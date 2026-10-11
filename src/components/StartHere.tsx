import { useEffect, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { AnimatePresence, motion } from 'motion/react';
import { Compass, X } from 'lucide-react';
import { useStore } from '@/store/useStore';

interface TourStep {
  title: string;
  body: string;
  /** Plain-language nudge to the relevant page. */
  go?: { label: string; href: string };
}

const STEPS: TourStep[] = [
  {
    title: 'Bits first',
    body: 'Everything here is built on the bit: a switch that is 0 or 1, on or off. Quantum adds one weird twist on top of that.',
    go: { label: 'Open the box', href: '/#magic-box' },
  },
  {
    title: 'The magic box',
    body: 'A qubit is like a box with a ball that is spinning. Open it and the ball suddenly picks left (|0⟩) or right (|1⟩). Until then it is neither.',
    go: { label: 'Try the box', href: '/#magic-box' },
  },
  {
    title: 'Entanglement',
    body: 'Two boxes can be linked so that opening one instantly tells you about the other — with no message sent between them. Spooky, and real.',
    go: { label: 'See the lab', href: '/lab' },
  },
  {
    title: 'The game show',
    body: 'Alice and Bob play a game no classical team can win more than 75% of the time. Entanglement lifts that to about 85.4%.',
    go: { label: 'Play it later', href: '/lab' },
  },
  {
    title: 'Hype check',
    body: 'Quantum is genuine science but surrounded by hype. Use the hype checker to grade real claims from A to F.',
    go: { label: 'Visit the checker', href: '/videos' },
  },
];

const STORAGE_KEY = 'qubi-tour-dismissed';

function readDismissed(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}
function writeDismissed() {
  try {
    localStorage.setItem(STORAGE_KEY, '1');
  } catch {
    /* private mode / disabled storage — the tour simply shows again next time */
  }
}

/**
 * "Start here" guided tour for first-time visitors. Progress is remembered in
 * localStorage (wrapped in try/catch). Reduced-motion users get the same tour
 * without the slide/scale transitions.
 */
export default function StartHere() {
  const reduceMotion = useStore((s) => s.reduceMotion);
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  /* Auto-open once for first-time visitors, after the boot screen has cleared. */
  useEffect(() => {
    if (readDismissed()) return;
    const timer = window.setTimeout(() => setOpen(true), 1600);
    return () => window.clearTimeout(timer);
  }, []);

  const close = (remember: boolean) => {
    if (remember) writeDismissed();
    setOpen(false);
  };

  const last = step === STEPS.length - 1;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-4 left-4 z-40 hidden items-center gap-2 rounded-full border border-line-strong bg-elevated px-4 py-2.5 text-sm font-semibold text-ink shadow-lift transition hover:border-neon hover:text-neon sm:flex"
      >
        <Compass size={16} aria-hidden="true" />
        Start here
      </button>

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <AnimatePresence>
          {open && (
            <Dialog.Portal forceMount>
              <Dialog.Overlay asChild>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[70] bg-canvas/85 backdrop-blur-xl"
                />
              </Dialog.Overlay>
              <Dialog.Content asChild>
                <motion.div
                  initial={reduceMotion ? false : { opacity: 0, y: 16, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="fixed left-1/2 top-1/2 z-[71] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-line-strong bg-surface p-6 shadow-lift"
                >
                  <div className="flex items-start justify-between">
                    <span className="ui-label text-neon">Start here · {step + 1}/{STEPS.length}</span>
                    <Dialog.Close asChild>
                      <button
                        type="button"
                        aria-label="Close tour"
                        className="grid h-8 w-8 place-items-center rounded-lg border border-line text-ink-soft transition hover:text-neon"
                        onClick={() => close(false)}
                      >
                        <X size={15} />
                      </button>
                    </Dialog.Close>
                  </div>

                  <Dialog.Title className="mt-3 text-2xl">{STEPS[step].title}</Dialog.Title>
                  <Dialog.Description className="mt-2 text-sm leading-relaxed text-ink-soft">
                    {STEPS[step].body}
                  </Dialog.Description>

                  <div className="mt-6 flex items-center gap-1.5" aria-hidden="true">
                    {STEPS.map((_, i) => (
                      <span
                        key={i}
                        className={`h-1.5 flex-1 rounded-full transition-colors ${
                          i <= step ? 'bg-neon' : 'bg-line'
                        }`}
                      />
                    ))}
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => close(true)}
                      className="text-sm text-muted underline-offset-2 hover:underline"
                    >
                      Don’t show again
                    </button>

                    <div className="flex items-center gap-2">
                      {step > 0 && (
                        <button
                          type="button"
                          onClick={() => setStep((s) => Math.max(0, s - 1))}
                          className="rounded-lg border border-line px-4 py-2 text-sm text-ink-soft transition hover:border-line-strong"
                        >
                          Back
                        </button>
                      )}
                      {last ? (
                        <button
                          type="button"
                          onClick={() => close(true)}
                          className="rounded-lg bg-neon px-5 py-2 text-sm font-semibold text-neon-ink transition hover:brightness-110"
                        >
                          Got it
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
                          className="rounded-lg bg-neon px-5 py-2 text-sm font-semibold text-neon-ink transition hover:brightness-110"
                        >
                          Next
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              </Dialog.Content>
            </Dialog.Portal>
          )}
        </AnimatePresence>
      </Dialog.Root>
    </>
  );
}
