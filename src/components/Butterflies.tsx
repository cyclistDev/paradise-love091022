import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Butterfly, type ButterflyVariant } from './Butterfly';
import { makeRng } from '../lib/random';

interface ButterfliesProps {
  /** Number of butterflies (spec: 8–14). */
  count?: number;
  reducedMotion?: boolean;
}

const VARIANTS: ButterflyVariant[] = ['monarch', 'iridescent'];

/**
 * A flutter of butterflies tracing varied, looping flight paths across the
 * scene. Each insect has its own waypoints, size, speed and wing-flap cadence,
 * and the SVG wings flap independently of the body's travel.
 */
export function Butterflies({ count = 11, reducedMotion = false }: ButterfliesProps) {
  const flutter = useMemo(() => {
    const rng = makeRng(404);
    // Random but bounded waypoints (in vw/vh) for a wandering path.
    const wp = (n: number, spread: number) =>
      Array.from({ length: n }).map(() => (rng() - 0.5) * spread);
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      variant: VARIANTS[i % VARIANTS.length],
      size: 34 + rng() * 40,
      startX: rng() * 100,
      startY: 20 + rng() * 60,
      xPath: wp(5, 60),
      yPath: wp(5, 50),
      rotPath: wp(5, 50),
      duration: 14 + rng() * 12,
      delay: rng() * 8,
      flap: 0.32 + rng() * 0.3,
      opacity: 0.85 + rng() * 0.15,
    }));
  }, [count]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {flutter.map((b) => (
        <motion.div
          key={b.id}
          className="absolute"
          style={{
            left: `${b.startX}%`,
            top: `${b.startY}%`,
            opacity: b.opacity,
            filter: 'drop-shadow(0 6px 10px rgba(40,10,30,0.35))',
          }}
          animate={
            reducedMotion
              ? undefined
              : {
                  x: b.xPath.map((v) => `${v}vw`),
                  y: b.yPath.map((v) => `${v}vh`),
                  rotate: b.rotPath,
                }
          }
          transition={{
            duration: b.duration,
            delay: b.delay,
            repeat: Infinity,
            repeatType: 'mirror',
            ease: 'easeInOut',
          }}
        >
          <Butterfly variant={b.variant} size={b.size} flapDuration={b.flap} />
        </motion.div>
      ))}
    </div>
  );
}
