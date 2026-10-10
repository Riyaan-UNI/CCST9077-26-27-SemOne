import { useState } from 'react';
import { Link } from 'react-router-dom';
import * as Dialog from '@radix-ui/react-dialog';
import { ArrowUpRight, X } from 'lucide-react';
import Reveal from '@/components/Reveal';
import { concepts, type Concept } from '@/data/concepts';
import { useStore } from '@/store/useStore';

function ConceptCard({ concept, onOpen }: { concept: Concept; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group h-full w-full rounded-2xl border border-line bg-surface p-5 text-left transition hover:-translate-y-1 hover:border-line-strong hover:shadow-lift"
    >
      <div className="flex items-start justify-between">
        <span className="grid h-11 w-11 place-items-center rounded-xl border border-line bg-elevated font-mono text-lg text-neon">
          {concept.glyph}
        </span>
        <ArrowUpRight
          size={16}
          className="text-muted transition group-hover:text-neon"
          aria-hidden="true"
        />
      </div>
      <h3 className="mt-4 text-lg">{concept.name}</h3>
      <p className="mt-1 text-sm font-medium text-neon">{concept.tagline}</p>
      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">{concept.body}</p>
    </button>
  );
}

export default function ConceptGrid() {
  const [openId, setOpenId] = useState<string | null>(null);
  const react = useStore((s) => s.react);
  const active = concepts.find((c) => c.id === openId) ?? null;

  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {concepts.map((concept, i) => (
          <Reveal key={concept.id} delay={i * 0.04}>
            <ConceptCard
              concept={concept}
              onOpen={() => {
                setOpenId(concept.id);
                react('curious', `${concept.name}? Good question.`);
              }}
            />
          </Reveal>
        ))}
      </div>

      <Dialog.Root open={active !== null} onOpenChange={(o) => !o && setOpenId(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[70] bg-canvas/80 backdrop-blur-md data-[state=open]:animate-in" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-[71] w-[min(92vw,44rem)] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-line bg-surface p-6 shadow-lift sm:p-8">
            {active && (
              <>
                <div className="flex items-start gap-4">
                  <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-line bg-elevated font-mono text-2xl text-neon">
                    {active.glyph}
                  </span>
                  <div className="min-w-0">
                    <Dialog.Title className="text-2xl">{active.name}</Dialog.Title>
                    <Dialog.Description className="mt-1 text-sm font-medium text-neon">
                      {active.tagline}
                    </Dialog.Description>
                  </div>
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      aria-label="Close"
                      className="ml-auto grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-line text-ink-soft transition hover:text-neon"
                    >
                      <X size={16} />
                    </button>
                  </Dialog.Close>
                </div>

                <p className="mt-6 leading-relaxed text-ink-soft">{active.body}</p>

                <div className="mt-5 rounded-xl border border-line bg-elevated p-4">
                  <p className="ui-label text-neon">
                    Qubi's analogy
                  </p>
                  <p className="mt-2 font-hand text-2xl leading-snug text-ink">{active.analogy}</p>
                </div>

                {active.lab && (
                  <Link
                    to={active.lab.href}
                    onClick={() => setOpenId(null)}
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-neon px-4 py-2.5 font-semibold text-neon-ink transition hover:brightness-110"
                  >
                    {active.lab.label}
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </Link>
                )}
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
