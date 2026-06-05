import { motion } from 'framer-motion';
import { useId, type CSSProperties } from 'react';

export type ButterflyVariant = 'monarch' | 'iridescent';

interface ButterflyProps {
  variant?: ButterflyVariant;
  size?: number;
  /** Seconds per wing flap; slightly randomised per insect for life. */
  flapDuration?: number;
  className?: string;
  style?: CSSProperties;
}

/**
 * Inline SVG butterfly with realistic flapping wings.
 *
 * The flap is a `scaleX` animation on each wing group around the central body,
 * which foreshortens the wings exactly like a butterfly seen from above. Two
 * palettes are provided: a classic orange/black `monarch` and a jewel-toned
 * `iridescent` (teal→violet) morpho-style wing.
 */
export function Butterfly({
  variant = 'monarch',
  size = 56,
  flapDuration = 0.45,
  className,
  style,
}: ButterflyProps) {
  // Strip colons so the id is safe inside SVG `url(#...)` references.
  const uid = useId().replace(/:/g, '');

  const isMonarch = variant === 'monarch';

  // Wing fill gradients per palette.
  const wing = isMonarch ? (
    <radialGradient id={`${uid}-wing`} cx="50%" cy="50%" r="65%">
      <stop offset="0%" stopColor="#ffd27a" />
      <stop offset="45%" stopColor="#ff9b3d" />
      <stop offset="100%" stopColor="#e25a18" />
    </radialGradient>
  ) : (
    <linearGradient id={`${uid}-wing`} x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#7af5e4" />
      <stop offset="45%" stopColor="#4aa6ff" />
      <stop offset="100%" stopColor="#a05bff" />
    </linearGradient>
  );

  const edge = isMonarch ? '#3a2207' : '#241452';

  // Shared wing silhouette (upper + lower lobe) for the right side.
  // The left side mirrors it via scaleX(-1).
  const rightWing = (
    <g stroke={edge} strokeWidth="2.5" strokeLinejoin="round">
      <path d="M50 50 C 70 18, 96 20, 92 42 C 90 54, 70 54, 50 50 Z" fill={`url(#${uid}-wing)`} />
      <path d="M50 52 C 68 60, 86 70, 78 86 C 70 96, 54 74, 50 56 Z" fill={`url(#${uid}-wing)`} />
      {isMonarch ? (
        <>
          {/* Monarch white spots along the wing margin */}
          <circle cx="86" cy="34" r="2.2" fill="#fff6e6" stroke="none" />
          <circle cx="80" cy="44" r="1.8" fill="#fff6e6" stroke="none" />
          <circle cx="74" cy="82" r="2" fill="#fff6e6" stroke="none" />
        </>
      ) : (
        <circle cx="80" cy="36" r="4" fill="#fff" opacity="0.5" stroke="none" />
      )}
    </g>
  );

  // Each wing flaps with its own scaleX keyframes; left wing is the mirror.
  // The min stays >0.3 so the wing always reads as a wing, never a sliver.
  const flap = {
    animate: { scaleX: [1, 0.34, 1] },
    transition: {
      duration: flapDuration,
      repeat: Infinity,
      ease: 'easeInOut' as const,
    },
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <defs>{wing}</defs>

      {/* Right wing */}
      <motion.g style={{ transformBox: 'fill-box', transformOrigin: '50% 50%' }} {...flap}>
        {rightWing}
      </motion.g>

      {/* Left wing (mirror of the right, flapping in sync) */}
      <motion.g
        style={{ transformBox: 'fill-box', transformOrigin: '50% 50%' }}
        {...flap}
        transform="translate(100 0) scale(-1 1)"
      >
        {rightWing}
      </motion.g>

      {/* Body + antennae sit above the wings */}
      <g stroke={edge} strokeWidth="2" strokeLinecap="round" fill="none">
        <path d="M50 30 Q 46 22 42 18" />
        <path d="M50 30 Q 54 22 58 18" />
      </g>
      <ellipse cx="50" cy="52" rx="3.4" ry="20" fill={edge} />
      <circle cx="50" cy="33" r="3.6" fill={edge} />
    </svg>
  );
}
