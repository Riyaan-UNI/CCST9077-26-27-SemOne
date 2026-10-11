import { Check, X } from 'lucide-react';

const GOOD_AT = [
  {
    title: 'Factoring large numbers',
    detail: "Shor's algorithm can factor integers exponentially faster than any known classical method. This is why RSA encryption needs to prepare for a post-quantum future.",
  },
  {
    title: 'Searching unstructured databases',
    detail: "Grover's algorithm gives a quadratic speedup for search. For a database of size N, it needs about √N steps instead of N.",
  },
  {
    title: 'Simulating quantum systems',
    detail: 'Molecules, materials and chemical reactions are quantum by nature. Quantum computers can simulate them naturally — classical computers struggle.',
  },
  {
    title: 'Optimisation and sampling',
    detail: 'Some optimisation problems (routing, scheduling, machine learning) may see speedups from quantum annealing or variational algorithms.',
  },
];

const NOT_GOOD_AT = [
  {
    title: 'Everyday computing',
    detail: 'Quantum computers are not faster at browsing, gaming, word processing or streaming video. They excel only at specific mathematical problems.',
  },
  {
    title: 'Replacing all classical computers',
    detail: 'Classical computers remain better for most tasks. Quantum computers are co-processors, not replacements.',
  },
  {
    title: 'Instantly solving every hard problem',
    detail: 'Many problems (NP-complete) are believed to stay hard even for quantum computers. The speedups are problem-specific.',
  },
  {
    title: 'Magic powers from parallel universes',
    detail: 'The "many worlds" interpretation is one philosophical view, not an engineering blueprint. Quantum speedups come from interference, not from borrowing power from other universes.',
  },
];

/**
 * Honest panel: what quantum computers are good at, and what they are not.
 * This directly addresses the hype by being plain and specific.
 */
export default function QuantumComputersPanel() {
  return (
    <div className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="rounded-2xl border border-line bg-surface p-5">
          <div className="flex items-center gap-2">
            <Check size={18} className="text-verdict-fact" aria-hidden="true" />
            <h3 className="text-lg">What they are good at</h3>
          </div>
          <ul className="mt-4 space-y-4">
            {GOOD_AT.map((item) => (
              <li key={item.title} className="text-sm">
                <p className="font-semibold text-ink-soft">{item.title}</p>
                <p className="mt-1 leading-relaxed text-muted">{item.detail}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-5">
          <div className="flex items-center gap-2">
            <X size={18} className="text-verdict-myth" aria-hidden="true" />
            <h3 className="text-lg">What they are NOT good at</h3>
          </div>
          <ul className="mt-4 space-y-4">
            {NOT_GOOD_AT.map((item) => (
              <li key={item.title} className="text-sm">
                <p className="font-semibold text-ink-soft">{item.title}</p>
                <p className="mt-1 leading-relaxed text-muted">{item.detail}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="rounded-2xl border border-line bg-surface p-5">
        <p className="ui-label text-hype-amber">The honest summary</p>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-soft">
          Quantum computers are genuine scientific breakthroughs, but they are not magic. They solve
          a specific set of problems faster than classical computers can. For everything else,
          classical computing remains the right tool. The hype around "infinitely faster" or
          "parallel-universe power" is just that — hype.
        </p>
      </div>
    </div>
  );
}
