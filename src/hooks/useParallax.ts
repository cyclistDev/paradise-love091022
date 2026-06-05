import { useCallback, useEffect, useRef, useState } from 'react';
import { useMotionValue, useReducedMotion, type MotionValue } from 'framer-motion';

/**
 * Permission state for device-orientation parallax.
 * - `unsupported`: no device-orientation API (most desktops) → drag fallback only.
 * - `prompt`:      iOS 13+ requires an explicit user gesture to grant access.
 * - `granted`:     orientation events are flowing.
 * - `denied`:      the user declined the iOS permission prompt.
 */
export type MotionPermission = 'unsupported' | 'prompt' | 'granted' | 'denied';

export interface ParallaxState {
  /** Smoothed, normalised horizontal offset in roughly [-1, 1]. */
  x: MotionValue<number>;
  /** Smoothed, normalised vertical offset in roughly [-1, 1]. */
  y: MotionValue<number>;
  /** Current permission state for the motion sensor. */
  permission: MotionPermission;
  /** True only when an explicit "Enable Motion" gesture is still required (iOS). */
  needsPermission: boolean;
  /** Request iOS motion permission. Must be called from a user gesture. */
  requestPermission: () => Promise<void>;
}

/** iOS exposes a static `requestPermission()` that standard DOM types omit. */
type DeviceOrientationEventiOS = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<'granted' | 'denied'>;
};

/** Linear interpolation. */
const lerp = (from: number, to: number, t: number) => from + (to - from) * t;

/** Clamp to [-1, 1] so a single layer can never fly off screen. */
const clamp1 = (n: number) => Math.max(-1, Math.min(1, n));

/**
 * useParallax — a unified parallax driver.
 *
 * Combines device orientation (gyroscope) and a mouse/touch drag fallback into
 * a single pair of smoothed, normalised motion values. Consumers multiply these
 * by a per-layer depth so closer layers (butterflies) move more than distant
 * ones (bokeh). Honors `prefers-reduced-motion` by staying perfectly still.
 *
 * @param smoothing  Lerp factor per frame (0–1). Lower = dreamier, laggier.
 */
export function useParallax(smoothing = 0.085): ParallaxState {
  const prefersReducedMotion = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // The raw, un-smoothed target the rAF loop chases each frame.
  const target = useRef({ x: 0, y: 0 });

  // Detect at mount (in a lazy initializer, so we never setState in an effect)
  // whether this device exposes an orientation sensor, and whether it gates
  // access behind an explicit iOS permission prompt.
  const [permission, setPermission] = useState<MotionPermission>(() => {
    if (typeof window === 'undefined' || typeof DeviceOrientationEvent === 'undefined') {
      return 'unsupported';
    }
    const iosEvent = DeviceOrientationEvent as DeviceOrientationEventiOS;
    return typeof iosEvent.requestPermission === 'function' ? 'prompt' : 'granted';
  });

  // --- Device orientation listener -----------------------------------------
  // Attached once permission is (or doesn't need to be) granted.
  useEffect(() => {
    if (prefersReducedMotion) return;
    if (permission !== 'granted') return;

    const handleOrientation = (event: DeviceOrientationEvent) => {
      // gamma: left/right tilt [-90, 90]; beta: front/back tilt [-180, 180].
      const gamma = event.gamma ?? 0;
      const beta = event.beta ?? 0;
      // Normalise to [-1, 1] using a comfortable ~35° tilt range, and bias the
      // vertical pivot around the portrait holding angle (~45°).
      target.current.x = clamp1(gamma / 35);
      target.current.y = clamp1((beta - 45) / 35);
    };

    window.addEventListener('deviceorientation', handleOrientation, true);
    return () => window.removeEventListener('deviceorientation', handleOrientation, true);
  }, [permission, prefersReducedMotion]);

  // --- Mouse / touch drag fallback -----------------------------------------
  // Works everywhere; on desktop, plain mouse-move also nudges the scene.
  useEffect(() => {
    if (prefersReducedMotion) return;

    let dragging = false;
    let startX = 0;
    let startY = 0;
    let baseX = 0;
    let baseY = 0;

    const point = (e: PointerEvent | MouseEvent) => ({ x: e.clientX, y: e.clientY });

    const onPointerDown = (e: PointerEvent) => {
      dragging = true;
      const p = point(e);
      startX = p.x;
      startY = p.y;
      baseX = target.current.x;
      baseY = target.current.y;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (dragging) {
        // Drag relative to grab point; full screen drag ≈ full deflection.
        const dx = (e.clientX - startX) / (window.innerWidth * 0.5);
        const dy = (e.clientY - startY) / (window.innerHeight * 0.5);
        target.current.x = clamp1(baseX + dx);
        target.current.y = clamp1(baseY + dy);
        return;
      }
      // Passive hover parallax on devices with a fine pointer (desktop).
      if (window.matchMedia('(pointer: fine)').matches) {
        target.current.x = clamp1((e.clientX / window.innerWidth) * 2 - 1);
        target.current.y = clamp1((e.clientY / window.innerHeight) * 2 - 1);
      }
    };

    const onPointerUp = () => {
      dragging = false;
    };

    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);

    return () => {
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
    };
  }, [prefersReducedMotion]);

  // --- Smoothing loop -------------------------------------------------------
  useEffect(() => {
    if (prefersReducedMotion) {
      // Snap to rest and never animate.
      x.set(0);
      y.set(0);
      return;
    }

    let raf = 0;
    const tick = () => {
      x.set(lerp(x.get(), target.current.x, smoothing));
      y.set(lerp(y.get(), target.current.y, smoothing));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [prefersReducedMotion, smoothing, x, y]);

  // --- iOS permission request ----------------------------------------------
  const requestPermission = useCallback(async () => {
    const iosEvent = DeviceOrientationEvent as DeviceOrientationEventiOS;
    if (typeof iosEvent.requestPermission !== 'function') {
      setPermission('granted');
      return;
    }
    try {
      const result = await iosEvent.requestPermission();
      setPermission(result === 'granted' ? 'granted' : 'denied');
    } catch {
      setPermission('denied');
    }
  }, []);

  return {
    x,
    y,
    permission,
    needsPermission: permission === 'prompt',
    requestPermission,
  };
}
