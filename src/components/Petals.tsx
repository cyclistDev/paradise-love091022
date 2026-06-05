import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Flower, type FlowerVariant } from './Flower';
import { makeRng } from '../lib/random';

interface PetalsProps {
  count?: number;
  reducedMotion?: boolean;
}

const VARIANTS: FlowerVariant[] = ['peony', 'orchid', 'blossom'];

/**
 * Cascading flowers/petals that fall from above with depth-of-field blur and a
 * gentle tumble. Each petal gets a random species, size, blur (near vs. far),
 * sway and rotation for a parallax-rich, organic snowfall of flowers.
 */
export function Petals({ count = 22, reducedMotion = false }: PetalsProps) {
  const petals = useMemo(() => {
    const rng = makeRng(303);
    return Array.from({ length: count }).map((_, i) => {
      // depth in [0,1]: 0 = far (small, blurred, slow), 1 = near (big, sharp).
      const depth = rng();
      return {
        id: i,
        variant: VARIANTS[i % VARIANTS.length],
        left: rng() * 100,
        size: 26 + depth * 64,
        blur: (1 - depth) * 3.5,
        opacity: 0.45 + depth * 0.5,
        duration: 11 - depth * 4 + rng() * 4,
        delay: rng() * 12,
        sway: (rng() - 0.5) * 120,
        spin: (rng() - 0.5) * 540,
      };
    });
  }, [count]);

  if (reducedMotion) {
    // A still bouquet scattered across the frame instead of a falling animation.
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {petals.slice(0, 10).map((p) => (
          <Flower
            key={p.id}
            variant={p.variant}
            size={p.size}
            style={{
              position: 'absolute',
              left: `${p.left}%`,
              top: `${(p.id * 11) % 90}%`,
              opacity: p.opacity,
              filter: `blur(${p.blur}px)`,
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {petals.map((p) => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.left}%`,
            top: 0,
            filter: `blur(${p.blur}px) drop-shadow(0 6px 8px rgba(80,20,50,0.35))`,
            opacity: p.opacity,
          }}
          initial={{ y: '-15vh', x: 0, rotate: 0 }}
          animate={{
            y: '115vh',
            x: [0, p.sway, -p.sway * 0.6, p.sway * 0.3, 0],
            rotate: p.spin,
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <Flower variant={p.variant} size={p.size} />
        </motion.div>
      ))}
    </div>
  );
}
