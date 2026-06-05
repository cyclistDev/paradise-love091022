import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { makeRng, range } from '../lib/random';

interface ShimmerParticlesProps {
  count?: number;
  reducedMotion?: boolean;
}

/**
 * Tiny golden motes that drift gently upward and twinkle — the "fireflies at
 * dusk" layer. Sits between bokeh and the flowers in parallax depth.
 */
export function ShimmerParticles({ count = 36, reducedMotion = false }: ShimmerParticlesProps) {
  const motes = useMemo(() => {
    const rng = makeRng(202);
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: rng() * 100,
      bottom: -10 - rng() * 20,
      size: range(rng, 2, 6),
      rise: range(rng, 60, 110), // % of viewport height to travel
      duration: range(rng, 7, 16),
      delay: rng() * 10,
      sway: (rng() - 0.5) * 60,
    }));
  }, [count]);

  if (reducedMotion) {
    // Show a sparse, static sprinkle so the scene still feels alive.
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {motes.slice(0, 10).map((m) => (
          <span
            key={m.id}
            className="absolute rounded-full bg-amber-300"
            style={{
              left: `${m.left}%`,
              top: `${20 + (m.id * 7) % 60}%`,
              width: m.size,
              height: m.size,
              opacity: 0.6,
              boxShadow: '0 0 8px rgba(255,207,122,0.8)',
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {motes.map((m) => (
        <motion.span
          key={m.id}
          className="absolute rounded-full bg-amber-300"
          style={{
            left: `${m.left}%`,
            bottom: `${m.bottom}%`,
            width: m.size,
            height: m.size,
            boxShadow: '0 0 8px rgba(255,207,122,0.9)',
          }}
          initial={{ opacity: 0, y: 0, x: 0 }}
          animate={{
            opacity: [0, 1, 1, 0],
            y: [`0vh`, `-${m.rise}vh`],
            x: [0, m.sway, 0],
          }}
          transition={{
            duration: m.duration,
            delay: m.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
