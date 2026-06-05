import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { makeRng, range } from '../lib/random';

interface BokehProps {
  count?: number;
  reducedMotion?: boolean;
}

/**
 * Soft, out-of-focus light circles drifting lazily behind everything. This is
 * the deepest parallax layer, so it should move the least.
 */
export function Bokeh({ count = 14, reducedMotion = false }: BokehProps) {
  const circles = useMemo(() => {
    const rng = makeRng(101);
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: rng() * 100,
      top: rng() * 100,
      size: range(rng, 40, 180),
      hue: rng() > 0.5 ? '255, 207, 122' : '255, 178, 122',
      opacity: range(rng, 0.1, 0.32),
      duration: range(rng, 9, 19),
      delay: rng() * 6,
      drift: range(rng, 12, 38),
    }));
  }, [count]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {circles.map((c) => (
        <motion.span
          key={c.id}
          className="absolute rounded-full"
          style={{
            left: `${c.left}%`,
            top: `${c.top}%`,
            width: c.size,
            height: c.size,
            background: `radial-gradient(circle, rgba(${c.hue}, ${c.opacity}) 0%, rgba(${c.hue}, 0) 70%)`,
            filter: 'blur(6px)',
          }}
          animate={
            reducedMotion
              ? undefined
              : { y: [0, -c.drift, 0], opacity: [0.7, 1, 0.7] }
          }
          transition={{
            duration: c.duration,
            delay: c.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
