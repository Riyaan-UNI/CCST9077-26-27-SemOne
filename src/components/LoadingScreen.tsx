import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Qubi from '@/components/Qubi';
import { site } from '@/data/site';

const BOOT_LINES = [
  'warming up the cathode ray',
  'charging a single qubit',
  'letting the possibilities blur',
  'collapsing the screen into focus',
];

type Phase = 'boot' | 'clear' | 'hi';

/**
 * Quantum-themed boot screen. Shown once per browser session.
 *
 * The Qubi face starts as blurred, flickering pixel eyes — a visual pun on a
 * qubit in superposition — then "collapses" into a sharp smile and a HI once the
 * app is ready. About 1.2 s minimum; never longer than needed. Skipped on
 * repeat visits within a session (handled by Layout via sessionStorage).
 */
export default function LoadingScreen({ onDone }: { onDone: () => void }) {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [line, setLine] = useState(0);

  useEffect(() => {
    const started = performance.now();
    const duration = 1250;
    let raf = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - started) / duration);
      setProgress(1 - Math.pow(1 - t, 2.2));
      setLine(Math.min(BOOT_LINES.length - 1, Math.floor(t * BOOT_LINES.length)));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        window.setTimeout(() => {
          setVisible(false);
          onDone();
        }, 280);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);

  const phase: Phase = progress < 0.55 ? 'boot' : progress < 0.85 ? 'clear' : 'hi';

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45 }}
          className="fixed inset-0 z-[100] grid place-items-center bg-canvas"
          role="status"
          aria-live="polite"
          aria-label="Loading Qubi"
        >
          <div className="crt-lines pointer-events-none absolute inset-0 opacity-60" />
          <div className="relative flex w-full max-w-sm flex-col items-center px-6 text-center">
            <div className="relative">
              <motion.div
                animate={
                  phase === 'boot'
                    ? { filter: 'blur(5px)', opacity: [0.5, 1, 0.55, 1] }
                    : { filter: 'blur(0px)', opacity: 1 }
                }
                transition={
                  phase === 'boot'
                    ? { duration: 0.22, repeat: Infinity, ease: 'easeInOut' }
                    : { duration: 0.4 }
                }
              >
                <Qubi mood={phase === 'boot' ? 'idle' : 'happy'} size={172} float={false} />
              </motion.div>

              {phase === 'hi' && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25 }}
                  className="pointer-events-none absolute inset-0 grid place-items-center font-mono text-4xl tracking-[0.2em] text-neon text-glow"
                  style={{ paddingTop: '14%' }}
                  aria-hidden="true"
                >
                  HI
                </motion.span>
              )}
            </div>

            <p className="mt-8 font-mono text-2xl tracking-[0.2em] text-neon text-glow">
              {site.mascot.name.toUpperCase()}
            </p>
            <p className="mt-1 text-sm uppercase tracking-[0.22em] text-muted">
              {site.courseTitle}
            </p>

            <div className="mt-8 h-1 w-full overflow-hidden rounded-full border border-line bg-elevated">
              <motion.div className="h-full bg-neon" style={{ width: `${Math.round(progress * 100)}%` }} />
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
