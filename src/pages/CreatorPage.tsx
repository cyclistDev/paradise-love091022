import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  DEFAULT_HEADLINE,
  DEFAULT_SUB,
  buildRevealUrl,
  encodeRevealParams,
  type RevealParams,
} from '../lib/params';
import { drawQrToCanvas, qrToDataUrl, downloadDataUrl } from '../lib/qr';
import { PreviewThumbnail } from '../components/PreviewThumbnail';
import { Flower } from '../components/Flower';

/**
 * Creator / Landing page. Collects the recipient name, headline and subline,
 * shows a live preview, and generates a clean, printable QR code that links to
 * the reveal with all data encoded in the URL.
 */
export function CreatorPage() {
  const [params, setParams] = useState<RevealParams>({
    to: '',
    headline: DEFAULT_HEADLINE,
    sub: DEFAULT_SUB,
  });

  const [revealUrl, setRevealUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Whenever a QR has been generated, redraw it if the inputs change so the
  // displayed code never drifts from the current message.
  useEffect(() => {
    if (!revealUrl || !canvasRef.current) return;
    const url = buildRevealUrl(params);
    setRevealUrl(url);
    drawQrToCanvas(canvasRef.current, url).catch(() => {
      /* canvas drawing is best-effort; ignore transient failures */
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const update = (patch: Partial<RevealParams>) =>
    setParams((p) => ({ ...p, ...patch }));

  const handleGenerate = async () => {
    const url = buildRevealUrl(params);
    setRevealUrl(url);
    // Draw on the next tick once the canvas is mounted.
    requestAnimationFrame(() => {
      if (canvasRef.current) {
        drawQrToCanvas(canvasRef.current, url).catch(() => {});
      }
    });
  };

  const handleDownload = async () => {
    const url = buildRevealUrl(params);
    const dataUrl = await qrToDataUrl(url, 1200);
    const slug = (params.to || 'paradise').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    downloadDataUrl(dataUrl, `paradise-qr-${slug}.png`);
  };

  const previewHref = `/reveal?${encodeRevealParams(params)}`;

  return (
    <div className="relative min-h-[100dvh] w-full overflow-hidden">
      {/* Warm landing backdrop */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(120% 90% at 50% 0%, #ffd9a0 0%, #f7b06a 24%, #e07a64 50%, #7e3553 78%, #2c1525 100%)',
        }}
      />
      <Flower variant="peony" size={150} style={{ position: 'absolute', top: -40, left: -40, opacity: 0.35 }} />
      <Flower variant="orchid" size={120} style={{ position: 'absolute', bottom: -30, right: -20, opacity: 0.3 }} />

      <main className="mx-auto flex w-full max-w-md flex-col gap-8 px-6 py-12">
        {/* Pitch */}
        <motion.header
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className="text-center"
        >
          <p className="mb-3 text-xs tracking-[0.4em] text-wine-900/70 uppercase">
            A love letter in light
          </p>
          <h1 className="font-display text-4xl leading-tight font-semibold text-wine-900 sm:text-5xl">
            Give them a paradise
          </h1>
          <p className="mx-auto mt-4 max-w-sm text-lg text-wine-800/90 italic">
            Craft a private golden-hour reveal — flowers, butterflies and a
            message only they can unlock. Print the code, hide it anywhere, and
            watch their world bloom.
          </p>
        </motion.header>

        {/* Live preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.15 }}
          className="flex flex-col items-center gap-3"
        >
          <Link to={previewHref} className="group">
            <PreviewThumbnail params={params} />
          </Link>
          <Link
            to={previewHref}
            className="text-sm tracking-widest text-wine-900/80 uppercase underline-offset-4 hover:underline"
          >
            Preview the reveal →
          </Link>
        </motion.div>

        {/* Form */}
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25 }}
          className="flex flex-col gap-5 rounded-3xl bg-cream-50/85 p-6 shadow-xl ring-1 ring-white/40 backdrop-blur"
        >
          <Field label="Recipient name">
            <input
              type="text"
              value={params.to}
              onChange={(e) => update({ to: e.target.value })}
              placeholder="e.g. Sokha"
              className="paradise-input"
            />
          </Field>

          <Field label="Headline">
            <input
              type="text"
              value={params.headline}
              onChange={(e) => update({ headline: e.target.value })}
              placeholder={DEFAULT_HEADLINE}
              className="paradise-input"
            />
          </Field>

          <Field label="Subline">
            <input
              type="text"
              value={params.sub}
              onChange={(e) => update({ sub: e.target.value })}
              placeholder={DEFAULT_SUB}
              className="paradise-input"
            />
          </Field>

          <button
            type="button"
            onClick={handleGenerate}
            className="mt-1 w-full rounded-full bg-wine-800 px-6 py-3.5 font-display text-lg tracking-wide text-cream-50 shadow-lg transition hover:bg-wine-700 active:scale-[0.98]"
          >
            Generate QR
          </button>
        </motion.section>

        {/* Generated QR */}
        {revealUrl && (
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="flex flex-col items-center gap-4 rounded-3xl bg-cream-50 p-6 shadow-xl"
          >
            <canvas
              ref={canvasRef}
              className="h-56 w-56 rounded-xl"
              aria-label="QR code linking to the romantic reveal"
            />
            <p className="max-w-full truncate text-xs text-wine-800/70">{revealUrl}</p>
            <div className="flex w-full flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleDownload}
                className="w-full rounded-full border-2 border-wine-800 px-5 py-3 font-display tracking-wide text-wine-800 transition hover:bg-wine-800 hover:text-cream-50"
              >
                Download PNG
              </button>
              <Link
                to={previewHref}
                className="w-full rounded-full bg-amber-400 px-5 py-3 text-center font-display tracking-wide text-wine-900 transition hover:bg-amber-300"
              >
                Open reveal
              </Link>
            </div>
          </motion.section>
        )}

        <footer className="pb-6 text-center text-xs tracking-widest text-wine-900/50 uppercase">
          Everything lives in the link · no account needed
        </footer>
      </main>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-xs tracking-[0.25em] text-wine-800/80 uppercase">{label}</span>
      {children}
    </label>
  );
}
