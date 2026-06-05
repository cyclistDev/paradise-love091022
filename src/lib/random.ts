/**
 * Deterministic, dependency-free pseudo-random generator (mulberry32).
 *
 * Used for the decorative layers so their layout is *stable* across renders —
 * which keeps the scene curated and satisfies React's purity rules (unlike
 * `Math.random()`, this is idempotent for a given seed).
 */
export function makeRng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Convenience: a value in [min, max) from an rng. */
export function range(rng: () => number, min: number, max: number): number {
  return min + rng() * (max - min);
}
