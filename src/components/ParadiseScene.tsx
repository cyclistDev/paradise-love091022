import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import type { RevealParams } from '../lib/params';
import { useParallax, type ParallaxState } from '../hooks/useParallax';
import { ParallaxLayer } from './ParallaxLayer';
import { Bokeh } from './Bokeh';
import { ShimmerParticles } from './ShimmerParticles';
import { Petals } from './Petals';
import { Butterflies } from './Butterflies';
import { GoldenBloom } from './GoldenBloom';
import { RevealTypography } from './RevealTypography';

type Phase = 'dark' | 'bloom' | 'garden';

interface ParadiseSceneProps {
  params: RevealParams;
}

/** Depth multipliers per layer — butterflies strongest, bokeh weakest. */
const DEPTH = {
  bokeh: 0.12,
  shimmer: 0.3,
  petals: 0.6,
  butterflies: 1,
  text: 0.18,
} as const;

/**
 * Full-screen romantic reveal. Owns the shared parallax driver and the replay
 * counter; the actual timeline lives in `RevealSequence`, which is remounted on
 * every replay (via `key`) so its phase resets cleanly without setState-in-effect.
 */
export function ParadiseScene({ params }: ParadiseSceneProps) {
  const parallax = useParallax();
  const [cycle, setCycle] = useState(0);
  const replay = useCallback(() => setCycle((c) => c + 1), []);

  return (
    <RevealSequence key={cycle} params={params} parallax={parallax} onReplay={replay} />
  );
}

interface RevealSequenceProps {
  params: RevealParams;
  parallax: ParallaxState;
  onReplay: () => void;
}

/**
 * One play-through of the reveal: dark → golden bloom → blooming garden, with a
 * haptic pulse on load and a "Tap to replay" affordance once it settles.
 */
function RevealSequence({ params, parallax, onReplay }: RevealSequenceProps) {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const [phase, setPhase] = useState<Phase>('dark');
  const [showReplay, setShowReplay] = useState(false);

  // Schedule the timeline. All setState happens inside timer callbacks (never
  // synchronously in the effect body), so renders don't cascade.
  useEffect(() => {
    // Subtle haptic-style pulse on load, where supported.
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate?.(prefersReducedMotion ? 10 : [0, 30, 40, 60]);
    }

    const toBloom = window.setTimeout(() => setPhase('bloom'), 200);
    const toGarden = window.setTimeout(
      () => setPhase('garden'),
      prefersReducedMotion ? 500 : 1400,
    );
    const toReplay = window.setTimeout(
      () => setShowReplay(true),
      prefersReducedMotion ? 1200 : 6500,
    );

    return () => {
      window.clearTimeout(toBloom);
      window.clearTimeout(toGarden);
      window.clearTimeout(toReplay);
    };
  }, [prefersReducedMotion]);

  const gardenVisible = phase === 'garden';

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-wine-950 select-none">
      {/* Warm golden-hour gradient wash, revealed as the bloom settles. */}
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, #f7b56b 0%, #f59b54 28%, #d96f6a 55%, #5e2a44 82%, #2c1525 100%)',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: gardenVisible ? 1 : 0 }}
        transition={{ duration: prefersReducedMotion ? 0.3 : 1.8, ease: 'easeOut' }}
      />
      {/* Soft vignette for depth */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 38%, rgba(0,0,0,0) 40%, rgba(25,11,22,0.55) 100%)',
        }}
      />

      {/* Parallax layers, deepest first. */}
      <AnimatePresence>
        {gardenVisible && (
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
          >
            <ParallaxLayer x={parallax.x} y={parallax.y} depth={DEPTH.bokeh} range={30}>
              <Bokeh reducedMotion={prefersReducedMotion} />
            </ParallaxLayer>

            <ParallaxLayer x={parallax.x} y={parallax.y} depth={DEPTH.shimmer} range={42}>
              <ShimmerParticles reducedMotion={prefersReducedMotion} />
            </ParallaxLayer>

            <ParallaxLayer x={parallax.x} y={parallax.y} depth={DEPTH.petals} range={60}>
              <Petals reducedMotion={prefersReducedMotion} />
            </ParallaxLayer>

            <ParallaxLayer
              x={parallax.x}
              y={parallax.y}
              depth={DEPTH.butterflies}
              range={80}
            >
              <Butterflies reducedMotion={prefersReducedMotion} />
            </ParallaxLayer>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Soft radial scrim behind the message to lift it off the bright sky. */}
      {gardenVisible && (
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 72% 46% at 50% 48%, rgba(44,21,37,0.62) 0%, rgba(44,21,37,0.28) 45%, rgba(44,21,37,0) 72%)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.6, delay: 0.5 }}
        />
      )}

      {/* Centred message, gently parallaxed. */}
      {gardenVisible && (
        <ParallaxLayer x={parallax.x} y={parallax.y} depth={DEPTH.text} range={24}>
          <RevealTypography params={params} delay={prefersReducedMotion ? 0.1 : 0.6} />
        </ParallaxLayer>
      )}

      {/* The golden bloom explosion overlay. */}
      <GoldenBloom active={phase !== 'dark'} reducedMotion={prefersReducedMotion} />

      {/* iOS "Enable Motion" button to unlock gyroscope parallax. */}
      {gardenVisible && parallax.needsPermission && (
        <motion.button
          type="button"
          onClick={parallax.requestPermission}
          className="absolute bottom-24 left-1/2 z-20 -translate-x-1/2 rounded-full border border-amber-300/60 bg-wine-900/50 px-5 py-2 text-sm tracking-widest text-cream-50 uppercase backdrop-blur-md"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
        >
          Enable Motion
        </motion.button>
      )}

      {/* Tap to replay, shown once the sequence has played out. */}
      <AnimatePresence>
        {showReplay && (
          <motion.button
            type="button"
            onClick={onReplay}
            className="absolute bottom-10 left-1/2 z-20 -translate-x-1/2 rounded-full border border-cream-50/40 bg-cream-50/10 px-6 py-2.5 font-display text-base tracking-wide text-cream-50 backdrop-blur-md"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            whileTap={{ scale: 0.94 }}
            transition={{ duration: 0.6 }}
          >
            ✿ Tap to replay
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
