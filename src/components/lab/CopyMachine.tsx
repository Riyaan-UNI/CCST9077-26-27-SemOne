import { useState } from 'react';
import { Copy, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStore } from '@/store/useStore';

/**
 * Copy Machine — demonstrates the no-cloning theorem.
 *
 * Classical bits copy fine. Quantum states cannot be copied, which is why
 * entanglement + cloning would allow faster-than-light messaging (the FLASH
 * argument), and why quantum money is possible.
 */
export default function CopyMachine() {
  const react = useStore((s) => s.react);
  const [classicalBit, setClassicalBit] = useState<0 | 1>(0);
  const [classicalCopies, setClassicalCopies] = useState<number[]>([]);
  const [quantumError, setQuantumError] = useState(false);

  const copyClassical = () => {
    setClassicalCopies((prev) => [...prev, classicalBit]);
    react('happy', 'Classical bit copied perfectly.');
  };

  const tryQuantumCopy = () => {
    setQuantumError(true);
    react('dizzy', 'ERROR: no-cloning theorem!');
  };

  return (
    <div className="space-y-6">
      {/* classical */}
      <div className="rounded-2xl border border-line bg-surface p-5">
        <p className="ui-label text-neon">Classical copy machine</p>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          A classical bit is just a 0 or a 1. You can copy it as many times as you like — every
          photocopier does this.
        </p>

        <div className="mt-4 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted">Bit to copy:</span>
            <button
              type="button"
              onClick={() => setClassicalBit((b) => (b === 0 ? 1 : 0))}
              className="rounded-lg border border-line bg-elevated px-4 py-2 font-mono text-lg text-neon transition hover:border-neon"
            >
              {classicalBit}
            </button>
          </div>
          <button
            type="button"
            onClick={copyClassical}
            className="inline-flex items-center gap-2 rounded-xl bg-neon px-4 py-2.5 font-semibold text-neon-ink transition hover:brightness-110"
          >
            <Copy size={15} aria-hidden="true" />
            Copy
          </button>
        </div>

        {classicalCopies.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {classicalCopies.map((c, i) => (
              <span
                key={i}
                className="rounded-lg border border-line bg-elevated px-3 py-1.5 font-mono text-sm text-neon"
              >
                {c}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* quantum */}
      <div className="rounded-2xl border border-line bg-surface p-5">
        <p className="ui-label text-error">Quantum copy machine</p>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          A qubit can be a blend of 0 and 1. Try to copy it and the universe says no.
        </p>

        <div className="mt-4">
          <button
            type="button"
            onClick={tryQuantumCopy}
            disabled={quantumError}
            className={cn(
              'inline-flex items-center gap-2 rounded-xl border px-5 py-3 font-semibold transition',
              quantumError
                ? 'border-error/30 bg-error/10 text-error'
                : 'border-line-strong text-ink hover:border-error hover:text-error',
            )}
          >
            <Copy size={15} aria-hidden="true" />
            Try to copy a qubit
          </button>
        </div>

        {quantumError && (
          <div className="mt-4 rounded-xl border border-error/30 bg-error/10 p-4" aria-live="polite">
            <div className="flex items-center gap-2 text-error">
              <XCircle size={18} aria-hidden="true" />
              <p className="font-mono text-sm font-semibold">ERROR: no-cloning theorem</p>
            </div>
            <p className="mt-2 text-sm text-ink-soft">
              The universe has copy-protection. You cannot make an exact duplicate of an unknown
              quantum state. This is not a engineering limitation — it is built into the maths.
            </p>
          </div>
        )}
      </div>

      {/* FLASH + banknote */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-line bg-surface p-5">
          <p className="ui-label text-hype-amber">Why this matters · the FLASH idea</p>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">
            If Alice could clone her entangled qubit, she could measure one copy and keep the other.
            That would let her send a message to Bob instantly. But cloning is impossible — so
            entanglement <em>cannot</em> be used for faster-than-light messaging.
          </p>
        </div>
        <div className="rounded-2xl border border-line bg-surface p-5">
          <p className="ui-label text-cyan">Quantum money teaser</p>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">
            Because quantum states cannot be copied, a bank could issue bills encoded in quantum
            states. A forger cannot photocopy them — any attempt to measure destroys the original.
          </p>
          <p className="mt-2 text-xs text-muted">
            This was Stephen Wiesner's idea, circa 1970.
          </p>
        </div>
      </div>
    </div>
  );
}
