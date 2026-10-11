import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import * as Tabs from '@radix-ui/react-tabs';
import { Box, Link2, Puzzle, BrainCircuit } from 'lucide-react';
import Page from '@/components/Page';
import Section from '@/components/Section';
import Qubi from '@/components/Qubi';
import Level1MagicBox from '@/components/computer/Level1MagicBox';
import Level2Entangle from '@/components/computer/Level2Entangle';
import Level3Puzzles from '@/components/computer/Level3Puzzles';
import QuantumComputersPanel from '@/components/computer/QuantumComputersPanel';
import { cn } from '@/lib/utils';

const TABS = [
  { id: 'level1', label: 'Level 1 · Magic box', icon: Box },
  { id: 'level2', label: 'Level 2 · Entangle', icon: Link2 },
  { id: 'level3', label: 'Level 3 · Puzzles', icon: Puzzle },
  { id: 'honest', label: 'What they are (not)', icon: BrainCircuit },
] as const;

export default function Computer() {
  const location = useLocation();
  const hashToTab: Record<string, string> = {
    '#level1': 'level1',
    '#level2': 'level2',
    '#level3': 'level3',
    '#honest': 'honest',
  };
  const [tab, setTab] = useState<string>(() =>
    hashToTab[location.hash] || 'level1',
  );

  return (
    <Page>
      <header className="relative overflow-hidden border-b border-line pt-32 pb-14">
        <div className="absolute inset-0 grid-paper opacity-40" />
        <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="ui-label text-neon">Qubit & Circuit Playground</p>
            <h1 className="mt-3 text-4xl sm:text-5xl">Build your own quantum circuits</h1>
            <p className="mt-4 max-w-xl leading-relaxed text-ink-soft">
              Three levels of hands-on play: a single qubit as a magic box, two entangled qubits,
              and guided circuit puzzles. Every gate runs in your browser using the same
              statevector engine as the lab.
            </p>
          </div>
          <Qubi mood="excited" size={150} className="shrink-0" />
        </div>
      </header>

      <Section className="pt-12">
        <Tabs.Root value={tab} onValueChange={setTab}>
          <Tabs.List
            aria-label="Playground levels"
            className="inline-flex flex-wrap gap-1 rounded-xl border border-line bg-surface p-1"
          >
            {TABS.map(({ id, label, icon: Icon }) => (
              <Tabs.Trigger
                key={id}
                value={id}
                className={cn(
                  'inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-ink-soft transition',
                  'data-[state=active]:bg-neon data-[state=active]:text-neon-ink',
                  'hover:text-neon data-[state=active]:hover:text-neon-ink',
                )}
              >
                <Icon size={15} aria-hidden="true" />
                {label}
              </Tabs.Trigger>
            ))}
          </Tabs.List>

          <Tabs.Content value="level1" id="level1" className="mt-8 scroll-mt-24 focus-visible:outline-none">
            <div className="mb-6 max-w-3xl">
              <h2 className="text-2xl">Level 1: The Magic Box</h2>
              <p className="mt-2 leading-relaxed text-muted">
                One qubit, three operations. Shake it into superposition, flip it, or measure it.
                Watch the probability bars live as you play.
              </p>
            </div>
            <Level1MagicBox />
          </Tabs.Content>

          <Tabs.Content value="level2" id="level2" className="mt-8 scroll-mt-24 focus-visible:outline-none">
            <div className="mb-6 max-w-3xl">
              <h2 className="text-2xl">Level 2: Two Qubits and the Entangle Button</h2>
              <p className="mt-2 leading-relaxed text-muted">
                Start with two separate qubits. Press Entangle to create a Bell pair, then measure.
                The histogram should only ever show |00⟩ or |11⟩.
              </p>
            </div>
            <Level2Entangle />
          </Tabs.Content>

          <Tabs.Content value="level3" id="level3" className="mt-8 scroll-mt-24 focus-visible:outline-none">
            <div className="mb-6 max-w-3xl">
              <h2 className="text-2xl">Level 3: Circuit Puzzles</h2>
              <p className="mt-2 leading-relaxed text-muted">
                Build circuits to match a goal. Click gates from the palette to add them, click on
                a gate in the circuit to remove it. Use the hint if you are stuck.
              </p>
            </div>
            <Level3Puzzles />
          </Tabs.Content>

          <Tabs.Content value="honest" id="honest" className="mt-8 scroll-mt-24 focus-visible:outline-none">
            <div className="mb-6 max-w-3xl">
              <h2 className="text-2xl">What quantum computers are good at — and what they are not</h2>
              <p className="mt-2 leading-relaxed text-muted">
                An honest summary. No hype, no hand-waving. Quantum computers are genuine
                breakthroughs, but they are not magic.
              </p>
            </div>
            <QuantumComputersPanel />
          </Tabs.Content>
        </Tabs.Root>
      </Section>
    </Page>
  );
}
