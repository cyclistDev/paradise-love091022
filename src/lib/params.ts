/**
 * URL-param contract shared between the Creator page (which writes them into a
 * QR code) and the Reveal page (which reads them back). Everything the reveal
 * needs travels in the query string — there is no backend.
 */
export interface RevealParams {
  /** Recipient name, e.g. "Sokha". */
  to: string;
  /** Large headline, e.g. "Happy Anniversary, My Love". */
  headline: string;
  /** Supporting subline, e.g. "A Paradise Just for You". */
  sub: string;
}

export const DEFAULT_HEADLINE = 'Happy Anniversary, My Love';
export const DEFAULT_SUB = 'A Paradise Just for You';

/** Build a `?to=...&headline=...&sub=...` query string from reveal params. */
export function encodeRevealParams(params: RevealParams): string {
  const sp = new URLSearchParams();
  if (params.to.trim()) sp.set('to', params.to.trim());
  sp.set('headline', params.headline.trim() || DEFAULT_HEADLINE);
  sp.set('sub', params.sub.trim() || DEFAULT_SUB);
  return sp.toString();
}

/** Read reveal params from a query string, falling back to romantic defaults. */
export function decodeRevealParams(search: string): RevealParams {
  const sp = new URLSearchParams(search);
  return {
    to: sp.get('to')?.trim() ?? '',
    headline: sp.get('headline')?.trim() || DEFAULT_HEADLINE,
    sub: sp.get('sub')?.trim() || DEFAULT_SUB,
  };
}

/**
 * Absolute URL that the QR code points to. Uses the current origin so the same
 * build works on localhost, a preview deploy, or a custom domain.
 */
export function buildRevealUrl(params: RevealParams): string {
  const base =
    typeof window !== 'undefined' ? window.location.origin : 'https://example.com';
  return `${base}/reveal?${encodeRevealParams(params)}`;
}
