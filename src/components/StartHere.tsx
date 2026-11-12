import { useState } from 'react';
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
    body: 'A classical bit stores either 0 or 1. A qubit is a quantum system whose state can produce different outcomes when measured.',
    go: { label: 'Open the box', href: '/computer#level1' },
  },
  {
    title: 'The magic box',
    body: 'In this model, a qubit is prepared in a superposition. Measuring it in the 0/1 basis returns one definite result; repeated trials show the probabilities. The glowing marker is only a diagram, not a picture of a tiny ball.',
    go: { label: 'Try the box', href: '/computer#level1' },
  },
  {
    title: 'Entanglement',
    body: 'Entangled qubits can produce strong correlations, but each local result is random. Those correlations cannot be controlled to send a message between distant people.',
    go: { label: 'See the lab', href: '/lab' },
  },
  {
    title: 'The game show',
    body: 'In the CHSH game, a shared entangled state lets Alice and Bob win more often than any classical strategy. Individual rounds can still be lost.',
    go: { label: 'Play it later', href: '/lab' },
  },
  {
    title: 'Hype check',
    body: 'Quantum is genuine science but surrounded by hype. Use the hype checker to grade real claims from A to F.',
    go: { label: 'Visit the checker', href: '/delight' },
  },
];

/**
 * Optional "Start here" guided tour. It opens from its button so the home page
 * can lead with the videos. Reduced-motion users get the same tour without
 * the slide/scale transitions.
 */
export default function StartHere() {
  const reduceMotion = useStore((s) => s.reduceMotion);
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  const close = () => setOpen(false);

  const last = step === STEPS.length - 1;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="control-surface fixed bottom-4 left-4 z-40 hidden min-h-11 items-center gap-2 border-l-2 border-l-cyan bg-elevated px-4 py-2.5 text-sm font-semibold text-ink shadow-lift transition hover:border-neon hover:text-neon sm:flex"
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
                  className="fixed inset-0 z-[70] bg-black/48 backdrop-blur-sm"
                />
              </Dialog.Overlay>
              <Dialog.Content asChild>
                <motion.div
                  initial={reduceMotion ? false : { opacity: 0, y: 16, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="instrument-panel fixed left-1/2 top-1/2 z-[71] max-h-[calc(100dvh-1.5rem)] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-y-auto overscroll-contain border-t-2 border-t-cyan bg-surface p-5 shadow-lift sm:p-6"
                  data-lenis-prevent
                >
                  <div className="flex items-start justify-between">
                    <span className="ui-label text-neon">Start here · {step + 1}/{STEPS.length}</span>
                    <Dialog.Close asChild>
                      <button
                        type="button"
                        aria-label="Close tour"
                        className="grid h-8 w-8 place-items-center rounded-lg border border-line text-ink-soft transition hover:text-neon"
                        onClick={close}
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

                  <div className="mt-6 flex items-center justify-end">
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
                          onClick={close}
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
