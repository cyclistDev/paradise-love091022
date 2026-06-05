import { useId, type CSSProperties } from 'react';

export type FlowerVariant = 'peony' | 'orchid' | 'blossom';

interface FlowerProps {
  variant?: FlowerVariant;
  /** Pixel size (width = height). */
  size?: number;
  className?: string;
  style?: CSSProperties;
}

/**
 * Inline SVG flowers — no external assets. Three romantic species share a soft,
 * layered-petal language so they read as a single garden:
 *   - peony:   full, ruffled blush bloom
 *   - orchid:  five-lobed exotic flower with a golden throat
 *   - blossom: delicate five-petal cherry blossom
 *
 * Unique gradient ids come from React's `useId` so multiple flowers on screen
 * never collide in the SVG `<defs>` namespace.
 */
export function Flower({ variant = 'peony', size = 80, className, style }: FlowerProps) {
  // Strip colons so the id is safe inside SVG `url(#...)` references.
  const uid = useId().replace(/:/g, '');

  if (variant === 'orchid') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        className={className}
        style={style}
        aria-hidden="true"
      >
        <defs>
          <radialGradient id={`${uid}-petal`} cx="50%" cy="45%" r="60%">
            <stop offset="0%" stopColor="#fff3f7" />
            <stop offset="55%" stopColor="#f7bcd4" />
            <stop offset="100%" stopColor="#d77aa8" />
          </radialGradient>
          <radialGradient id={`${uid}-throat`} cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#ffe9a8" />
            <stop offset="100%" stopColor="#f5a623" />
          </radialGradient>
        </defs>
        {/* Five outer lobes */}
        {[0, 72, 144, 216, 288].map((deg) => (
          <ellipse
            key={deg}
            cx="50"
            cy="24"
            rx="15"
            ry="24"
            fill={`url(#${uid}-petal)`}
            opacity="0.95"
            transform={`rotate(${deg} 50 50)`}
          />
        ))}
        {/* Golden throat */}
        <circle cx="50" cy="50" r="11" fill={`url(#${uid}-throat)`} />
        <circle cx="50" cy="50" r="4.5" fill="#b9540a" opacity="0.8" />
      </svg>
    );
  }

  if (variant === 'blossom') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        className={className}
        style={style}
        aria-hidden="true"
      >
        <defs>
          <radialGradient id={`${uid}-petal`} cx="50%" cy="40%" r="65%">
            <stop offset="0%" stopColor="#fffafc" />
            <stop offset="60%" stopColor="#ffd9e2" />
            <stop offset="100%" stopColor="#f6a8c0" />
          </radialGradient>
        </defs>
        {[0, 72, 144, 216, 288].map((deg) => (
          <path
            key={deg}
            d="M50 50 C 40 30, 40 14, 50 8 C 60 14, 60 30, 50 50 Z"
            fill={`url(#${uid}-petal)`}
            transform={`rotate(${deg} 50 50)`}
          />
        ))}
        <circle cx="50" cy="50" r="6" fill="#ffd86b" />
        {[0, 72, 144, 216, 288].map((deg) => (
          <circle
            key={deg}
            cx="50"
            cy="42"
            r="1.6"
            fill="#e8890c"
            transform={`rotate(${deg} 50 50)`}
          />
        ))}
      </svg>
    );
  }

  // Default: peony — concentric rings of ruffled petals.
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={`${uid}-outer`} cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#ffd9c9" />
          <stop offset="100%" stopColor="#f3859b" />
        </radialGradient>
        <radialGradient id={`${uid}-inner`} cx="50%" cy="45%" r="60%">
          <stop offset="0%" stopColor="#fff4ec" />
          <stop offset="100%" stopColor="#f7adb0" />
        </radialGradient>
      </defs>
      {/* Outer ruffle */}
      {Array.from({ length: 10 }).map((_, i) => (
        <ellipse
          key={`o${i}`}
          cx="50"
          cy="22"
          rx="13"
          ry="22"
          fill={`url(#${uid}-outer)`}
          opacity="0.9"
          transform={`rotate(${i * 36} 50 50)`}
        />
      ))}
      {/* Inner ruffle, offset for fullness */}
      {Array.from({ length: 8 }).map((_, i) => (
        <ellipse
          key={`i${i}`}
          cx="50"
          cy="33"
          rx="9"
          ry="15"
          fill={`url(#${uid}-inner)`}
          opacity="0.95"
          transform={`rotate(${i * 45 + 22} 50 50)`}
        />
      ))}
      <circle cx="50" cy="50" r="7" fill="#ffe6b0" />
    </svg>
  );
}
