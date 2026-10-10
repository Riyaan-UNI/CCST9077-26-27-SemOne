import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Qubi from '@/components/Qubi';
import { site } from '@/data/site';

const BOOT_LINES = [
  'cooling the fridge to 15 millikelvin',
  'calibrating qubit coherence',
  'loading 3-qubit statevector',
  'entangling Qubi with the page',
];

/** Quantum-themed boot screen. Shown once per browser session. */
export default function LoadingScreen({ onDone }: { onDone: () => void }) {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [line, setLine] = useState(0);

  useEffect(() => {
    const started = performance.now();
    const duration = 1900;
    let raf = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - started) / duration);
      // ease-out so the bar feels like it is settling
      setProgress(1 - Math.pow(1 - t, 2.2));
      setLine(Math.min(BOOT_LINES.length - 1, Math.floor(t * BOOT_LINES.length)));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        window.setTimeout(() => {
          setVisible(false);
          onDone();
        }, 260);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100] grid place-items-center bg-canvas"
          role="status"
          aria-live="polite"
        >
          <div className="crt-lines pointer-events-none absolute inset-0 opacity-60" />
          <div className="relative flex w-full max-w-sm flex-col items-center px-6 text-center">
            <Qubi mood="idle" message="HI" size={168} />

            <p className="mt-8 font-mono text-2xl tracking-[0.2em] text-neon text-glow">
              {site.mascot.name.toUpperCase()}
            </p>
            <p className="mt-1 text-sm uppercase tracking-[0.22em] text-muted">
              {site.courseTitle}
            </p>

            <div className="mt-8 h-1 w-full overflow-hidden rounded-full border border-line bg-elevated">
              <motion.div
                className="h-full bg-neon"
                style={{ width: `${Math.round(progress * 100)}%` }}
              />
            </div>
            <p className="mt-3 h-4 font-mono text-sm text-muted" aria-hidden="true">
              {BOOT_LINES[line]}…
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
