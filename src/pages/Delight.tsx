import { useState } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { Star, HelpCircle, Sparkles } from 'lucide-react';
import Page from '@/components/Page';
import Section from '@/components/Section';
import Qubi from '@/components/Qubi';
import RateTheHype from '@/components/delight/RateTheHype';
import TwentyQuestions from '@/components/delight/TwentyQuestions';
import { cn } from '@/lib/utils';

const TABS = [
  { id: 'hype', label: 'Rate the Hype', icon: Star },
  { id: '20q', label: '20 Questions', icon: HelpCircle },
] as const;

export default function Delight() {
  const [tab, setTab] = useState('hype');

  return (
    <Page>
      <header className="relative overflow-hidden border-b border-line pt-32 pb-14">
        <div className="absolute inset-0 grid-paper opacity-40" />
        <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="ui-label text-neon">Delight</p>
            <h1 className="mt-3 text-4xl sm:text-5xl">Play, test, explore</h1>
            <p className="mt-4 max-w-xl leading-relaxed text-ink-soft">
              Mini-games and interactives that reinforce the course ideas through play.
              No equations required.
            </p>
          </div>
          <Qubi mood="excited" size={150} className="shrink-0" />
        </div>
      </header>

      <Section className="pt-12">
        <Tabs.Root value={tab} onValueChange={setTab}>
          <Tabs.List
            aria-label="Delight sections"
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

          <Tabs.Content value="hype" className="mt-8 focus-visible:outline-none">
            <div className="mb-6 max-w-3xl">
              <h2 className="text-2xl">Rate the Quantum Hype</h2>
              <p className="mt-2 leading-relaxed text-muted">
                Grade real quantum claims from A to F, then see how the course would grade them.
                Includes the good/bad/ugly taxonomy of popular science.
              </p>
            </div>
            <RateTheHype />
          </Tabs.Content>

          <Tabs.Content value="20q" className="mt-8 focus-visible:outline-none">
            <div className="mb-6 max-w-3xl">
              <h2 className="text-2xl">20 Questions · The Battleship Game</h2>
              <p className="mt-2 leading-relaxed text-muted">
                Find hidden ships on a grid using yes/no questions. Each question gives you one bit
                of information. This is how Shannon defined information in 1948.
              </p>
            </div>
            <TwentyQuestions />
          </Tabs.Content>
        </Tabs.Root>
      </Section>

      {/* Easter egg hint */}
      <Section className="pt-4 pb-20">
        <div className="rounded-2xl border border-line bg-surface p-6 text-center">
          <Sparkles size={20} className="mx-auto text-neon" aria-hidden="true" />
          <p className="mt-3 text-sm text-muted">
            There are secrets hidden across the site. Try the Konami code (↑ ↑ ↓ ↓ ← → ← → B A)
            if you are feeling nostalgic.
          </p>
        </div>
      </Section>
    </Page>
  );
}
