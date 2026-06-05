import { motion } from 'framer-motion';
import type { RevealParams } from '../lib/params';
import { Flower } from './Flower';
import { Butterfly } from './Butterfly';

interface PreviewThumbnailProps {
  params: RevealParams;
}

/**
 * A small, live golden-hour preview of what the recipient will see — a static
 * miniature of the reveal so the creator can sanity-check their words before
 * generating the QR.
 */
export function PreviewThumbnail({ params }: PreviewThumbnailProps) {
  return (
    <div className="relative mx-auto aspect-[9/16] w-44 overflow-hidden rounded-2xl shadow-2xl ring-1 ring-amber-300/30 sm:w-52">
      {/* Golden-hour backdrop */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, #f7b56b 0%, #f59b54 30%, #d96f6a 58%, #5e2a44 85%, #2c1525 100%)',
        }}
      />
      {/* Decorative flora */}
      <Flower variant="peony" size={56} style={{ position: 'absolute', top: -8, left: -10, opacity: 0.85 }} />
      <Flower variant="blossom" size={36} style={{ position: 'absolute', bottom: 12, right: 6, opacity: 0.9 }} />
      <motion.div
        className="absolute right-4 top-8"
        animate={{ y: [0, -6, 0], x: [0, 4, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Butterfly variant="iridescent" size={30} />
      </motion.div>

      {/* Message */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-3 text-center">
        {params.to && (
          <p className="mb-1 text-[8px] tracking-[0.3em] text-blush-200/90 uppercase">
            For {params.to}
          </p>
        )}
        <p className="font-display text-glow text-[13px] leading-tight font-semibold text-cream-50">
          {params.headline}
        </p>
        <p className="mt-1.5 text-[10px] text-amber-300 italic">{params.sub}</p>
      </div>
    </div>
  );
}
