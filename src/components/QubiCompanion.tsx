import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Qubi from '@/components/Qubi';
import { site } from '@/data/site';
import { useStore } from '@/store/useStore';

const BUBBLE_MS = 4200;

/**
 * A small Qubi that lives in the corner and comments on what you are doing.
 * It listens on the reaction event bus in the store.
 */
export default function QubiCompanion() {
  const reaction = useStore((s) => s.reaction);
  const react = useStore((s) => s.react);
  const reduceMotion = useStore((s) => s.reduceMotion);
  const [dismissedId, setDismissedId] = useState<number | null>(null);

  /* Auto-hide the bubble. The timeout callback — not the effect body — updates state. */
  useEffect(() => {
    if (!reaction) return;
    const id = reaction.id;
    const timer = window.setTimeout(() => setDismissedId(id), BUBBLE_MS);
    return () => window.clearTimeout(timer);
  }, [reaction]);

  const bubble = reaction && reaction.id !== dismissedId ? reaction.text : null;

  if (reduceMotion) return null;

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-40 hidden items-end gap-3 sm:flex">
      <AnimatePresence>
        {bubble && (
          <motion.div
            key={bubble}
            initial={{ opacity: 0, y: 8, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.94 }}
            className="pointer-events-auto mb-3 max-w-[15rem] rounded-2xl rounded-br-sm border border-line bg-elevated px-3.5 py-2.5 text-sm text-ink shadow-lift"
          >
            {bubble}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => {
          const phrases = site.mascot.catchphrases;
          react('happy', phrases[Math.floor(Math.random() * phrases.length)]);
        }}
        aria-label="Ask Qubi for a catchphrase"
        className="pointer-events-auto rounded-2xl transition hover:scale-105 active:scale-95"
      >
        <Qubi mood={bubble ? 'happy' : 'idle'} size={72} float={false} />
      </button>
    </div>
  );
}
