import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import * as Tabs from '@radix-ui/react-tabs';
import { Beaker, Dice5, ShieldCheck } from 'lucide-react';
import Page from '@/components/Page';
import Section from '@/components/Section';
import Qubi from '@/components/Qubi';
import Simulator from '@/components/lab/Simulator';
import ChshGame from '@/components/lab/ChshGame';
import { cn } from '@/lib/utils';

const TABS = [
  { id: 'simulator', label: 'Simulator', icon: Beaker },
  { id: 'chsh', label: 'CHSH game', icon: Dice5 },
] as const;

export default function Lab() {
  const location = useLocation();
  // The hash is read once on mount, so deep links like /lab#chsh open the right tab.
  const [tab, setTab] = useState<string>(() =>
    location.hash === '#chsh' ? 'chsh' : 'simulator',
  );

  return (
    <Page>
      <header className="relative overflow-hidden border-b border-line pt-32 pb-14">
        <div className="absolute inset-0 grid-paper opacity-40" />
        <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="ui-label text-neon">The lab</p>
            <h1 className="mt-3 text-4xl sm:text-5xl">Run the maths yourself</h1>
            <p className="mt-4 max-w-xl leading-relaxed text-ink-soft">
              Everything here executes locally in your browser, using a hand-written statevector
              engine. No server, no simulator dependency, and no rounding tricks.
            </p>
            <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-2 text-sm text-muted">
              <ShieldCheck size={14} className="text-neon" aria-hidden="true" />
              Unit-tested against the analytic results in Vitest
            </p>
          </div>
          <Qubi mood="curious" size={150} className="shrink-0" />
        </div>
      </header>

      <Section className="pt-12">
        <Tabs.Root value={tab} onValueChange={setTab}>
          <Tabs.List
            aria-label="Lab sections"
            className="inline-flex gap-1 rounded-xl border border-line bg-surface p-1"
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

          <Tabs.Content value="simulator" id="simulator" className="mt-8 scroll-mt-24 focus-visible:outline-none">
            <div className="mb-6 max-w-3xl">
              <h2 className="text-2xl">Quantum circuit simulator</h2>
              <p className="mt-2 leading-relaxed text-muted">
                Build a circuit gate by gate and watch the amplitudes move. Try the Bell pair preset,
                then measure it a few times: you will only ever see 00 or 11.
              </p>
            </div>
            <Simulator />
          </Tabs.Content>

          <Tabs.Content value="chsh" id="chsh" className="mt-8 scroll-mt-24 focus-visible:outline-none">
            <div className="mb-6 max-w-3xl">
              <h2 className="text-2xl">The CHSH game</h2>
              <p className="mt-2 leading-relaxed text-muted">
                A referee, two separated players, and one inequality that separates quantum mechanics
                from every classical theory. Run the rounds and watch the two win rates settle.
              </p>
            </div>
            <ChshGame />
          </Tabs.Content>
        </Tabs.Root>
      </Section>

      <Section className="pt-4">
        <div className="rounded-2xl border border-line bg-surface p-6 sm:p-8">
          <h2 className="text-xl">How the engine is verified</h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted">
            The simulator is a plain TypeScript module with no dependencies. Its test suite pins it to
            closed-form physics rather than to itself:
          </p>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {[
              'Equal-angle correlations of a Bell pair equal 1',
              'P(same outcome) = cos²(angleA − angleB)',
              'The CHSH quantum win rate is cos²(π/8) ≈ 0.8536',
              'Two Hadamards return the original state (H·H = I)',
              'A Bell state only ever yields |00⟩ or |11⟩',
              'The classical CHSH ceiling is exactly 3/4',
            ].map((t) => (
              <li
                key={t}
                className="flex items-start gap-3 rounded-xl border border-line bg-elevated px-4 py-3 text-sm text-ink-soft"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-neon" aria-hidden="true" />
                {t}
              </li>
            ))}
          </ul>
          <p className="mt-5 font-mono text-xs text-muted">npm test — runs the Vitest suite</p>
        </div>
      </Section>
    </Page>
  );
}
