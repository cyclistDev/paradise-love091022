import { motion } from 'framer-motion';

interface GoldenBloomProps {
  /** When true, plays the bloom explosion; otherwise stays dark/hidden. */
  active: boolean;
  reducedMotion?: boolean;
}

/**
 * The opening "golden bloom" — a radial burst of light that explodes from the
 * centre to wash the dark screen into a warm golden-hour glow. Rendered as two
 * stacked radial gradients (a hot core and a wide halo) plus a quick flash.
 */
export function GoldenBloom({ active, reducedMotion = false }: GoldenBloomProps) {
  if (!active) return null;

  // The bloom explodes, then dissipates — the ParadiseScene gradient provides
  // the lasting golden-hour wash, so the halo must not linger over the message.
  const coreAnim = reducedMotion
    ? { scale: 6, opacity: 0.0 }
    : { scale: [0, 2.4, 8], opacity: [0, 1, 0] };
  const haloAnim = reducedMotion
    ? { scale: 8, opacity: 0 }
    : { scale: [0, 3, 9], opacity: [0, 0.9, 0] };

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
      {/* Wide warm halo that lingers as the golden-hour wash */}
      <motion.div
        className="absolute aspect-square w-[60vmin] rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(255,214,140,0.95) 0%, rgba(245,166,35,0.55) 35%, rgba(94,42,68,0) 70%)',
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={haloAnim}
        transition={{ duration: reducedMotion ? 0.3 : 1.6, ease: 'easeOut' }}
      />
      {/* Hot core flash */}
      <motion.div
        className="absolute aspect-square w-[30vmin] rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(255,255,245,1) 0%, rgba(255,221,150,0.9) 45%, rgba(255,221,150,0) 75%)',
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={coreAnim}
        transition={{ duration: reducedMotion ? 0.3 : 1.2, ease: 'easeOut' }}
      />
    </div>
  );
}
