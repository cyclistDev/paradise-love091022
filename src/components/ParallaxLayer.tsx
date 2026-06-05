import type { ReactNode } from 'react';
import { motion, useTransform, type MotionValue } from 'framer-motion';

interface ParallaxLayerProps {
  x: MotionValue<number>;
  y: MotionValue<number>;
  /** Depth multiplier; larger = moves more (closer to the viewer). */
  depth: number;
  /** Max travel in pixels at depth 1 and full deflection. */
  range?: number;
  className?: string;
  children: ReactNode;
}

/**
 * Translates its children according to the shared parallax motion values scaled
 * by a per-layer `depth`. Closer layers (butterflies) use a high depth; distant
 * layers (bokeh) use a low one, producing convincing 3D separation.
 */
export function ParallaxLayer({
  x,
  y,
  depth,
  range = 48,
  className,
  children,
}: ParallaxLayerProps) {
  const tx = useTransform(x, (v) => v * depth * range);
  const ty = useTransform(y, (v) => v * depth * range);

  return (
    <motion.div
      className={className}
      style={{ x: tx, y: ty, position: 'absolute', inset: 0, willChange: 'transform' }}
    >
      {children}
    </motion.div>
  );
}
