import { motion } from 'framer-motion';
import type { RevealParams } from '../lib/params';

interface RevealTypographyProps {
  params: RevealParams;
  /** Delay (s) before the text begins fading in (after the bloom). */
  delay?: number;
}

/**
 * The centred, elegant message that fades up after the golden bloom: an
 * optional "For <name>" eyebrow, the headline in display serif, and the subline.
 */
export function RevealTypography({ params, delay = 1.6 }: RevealTypographyProps) {
  const container = {
    hidden: {},
    show: {
      transition: { delayChildren: delay, staggerChildren: 0.4 },
    },
  };
  const item = {
    hidden: { opacity: 0, y: 24, filter: 'blur(8px)' },
    show: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 1.2, ease: 'easeOut' as const },
    },
  };

  return (
    <motion.div
      className="relative z-10 flex h-full w-full flex-col items-center justify-center px-8 text-center"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {params.to && (
        <motion.p
          variants={item}
          className="mb-4 text-lg tracking-[0.35em] text-blush-200/90 uppercase"
        >
          For {params.to}
        </motion.p>
      )}

      <motion.h1
        variants={item}
        className="font-display text-glow max-w-[18ch] text-4xl leading-tight font-semibold text-cream-50 sm:text-6xl"
      >
        {params.headline}
      </motion.h1>

      <motion.p
        variants={item}
        className="mt-6 max-w-[26ch] text-2xl text-amber-300 italic sm:text-3xl"
      >
        {params.sub}
      </motion.p>

      <motion.div
        variants={item}
        className="mt-8 h-px w-24 bg-gradient-to-r from-transparent via-amber-300 to-transparent"
      />
    </motion.div>
  );
}
