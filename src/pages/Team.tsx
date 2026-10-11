import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, X } from 'lucide-react';
import Page from '@/components/Page';
import Section from '@/components/Section';
import Qubi from '@/components/Qubi';
import { DELIVERABLES, team } from '@/content/team';
import { useStore } from '@/store/useStore';

function MemberCard({ member }: { member: (typeof team)[number] }) {
  const reduceMotion = useStore((s) => s.reduceMotion);
  const [open, setOpen] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const pending = member.name.value.startsWith('[');

  const expand = reduceMotion
    ? { duration: 0 }
    : { duration: 0.32, ease: [0.22, 1, 0.36, 1] as const };
  const flip = reduceMotion ? { duration: 0 } : { duration: 0.3 };

  return (
    <div className="rounded-2xl border border-line bg-surface">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center gap-4 p-5 text-left transition hover:bg-elevated"
      >
        <Qubi mood={member.deliverables.includes('mascot') ? 'happy' : 'curious'} size={64} float={false} />
        <div className="min-w-0">
          <h3 className="text-xl">
            {member.name.value}
            {member.nickname && (
              <span className="ml-2 text-sm font-normal text-muted">“{member.nickname.value}”</span>
            )}
          </h3>
          <p className="font-hand text-lg text-neon">{member.title.value}</p>
          {pending && (
            <p className="mt-1 text-xs uppercase tracking-[0.12em] text-hype-amber">
              Name pending — placeholder shown
            </p>
          )}
        </div>
        <span className="ml-auto hidden text-sm text-muted sm:block">{open ? 'Close' : 'Open'}</span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={reduceMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={expand}
            className="overflow-hidden"
          >
            <div className="border-t border-line p-5">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={flipped ? 'fact' : 'work'}
                  initial={reduceMotion ? false : { rotateY: 90, opacity: 0 }}
                  animate={{ rotateY: 0, opacity: 1 }}
                  exit={reduceMotion ? { opacity: 0 } : { rotateY: -90, opacity: 0 }}
                  transition={flip}
                  style={{ transformPerspective: 800 }}
                >
                  {!flipped ? (
                    <>
                      <h4 className="ui-label text-neon">What {member.name.value} brought</h4>
                      <ul className="mt-3 space-y-2 text-sm text-ink-soft">
                        {member.contributions.map((c) => (
                          <li key={c.value} className="flex items-start gap-2">
                            <Check size={15} className="mt-0.5 shrink-0 text-neon" aria-hidden="true" />
                            <span>{c.value}</span>
                          </li>
                        ))}
                      </ul>
                      <button
                        type="button"
                        onClick={() => setFlipped(true)}
                        className="mt-4 rounded-lg border border-line px-4 py-2 text-sm text-ink-soft transition hover:border-line-strong"
                      >
                        Flip to fun fact
                      </button>
                    </>
                  ) : (
                    <>
                      <h4 className="ui-label text-neon">Fun fact</h4>
                      <p className="mt-3 text-sm leading-relaxed text-ink-soft">{member.funFact.value}</p>
                      <button
                        type="button"
                        onClick={() => setFlipped(false)}
                        className="mt-4 rounded-lg border border-line px-4 py-2 text-sm text-ink-soft transition hover:border-line-strong"
                      >
                        Flip back
                      </button>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Team() {
  const [showDevices, setShowDevices] = useState(false);

  return (
    <Page>
      <Section
        eyebrow="The people"
        title="Three humans, one robot"
        lead="A small team that built this site. Tap a card to open its magic box; flip it for a fun fact. All bios are pending your approval (see the placeholders)."
      >
        {/* Literary-devices toggle */}
        <div className="mb-8 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowDevices((v) => !v)}
            aria-pressed={showDevices}
            className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm transition hover:border-line-strong"
          >
            {showDevices ? <Check size={15} className="text-neon" /> : <X size={15} />}
            Show the literary devices
          </button>
          <span className="text-sm text-muted">
            {showDevices ? 'On — devices used in the bios are highlighted below.' : 'Off'}
          </span>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {team.map((m) => (
            <div key={m.id}>
              <MemberCard member={m} />
              {showDevices && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {m.devices.map((d) => (
                    <span
                      key={d.device}
                      title={`${d.device}: ${d.note} (e.g. “${d.example}”)`}
                      className="rounded-full border border-line bg-elevated px-3 py-1 text-xs text-ink-soft"
                    >
                      {d.device}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Entanglement diagram: who touched what */}
        <div className="mt-14 rounded-2xl border border-line bg-surface p-6">
          <h3 className="text-xl">The entanglement diagram</h3>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
            Like entangled qubits, the team shares the work. Each lit cell shows who touched a
            deliverable — the same person can touch several, just as entangled particles stay
            correlated.
          </p>

          <div className="mt-6 overflow-x-auto scrollbar-hidden">
            <table className="w-full border-collapse text-sm" style={{ minWidth: '18rem' }}>
              <caption className="sr-only">Which deliverables each team member worked on</caption>
              <thead>
                <tr>
                  <th scope="col" className="py-2 pr-4 text-left ui-label text-muted">
                    Member
                  </th>
                  {DELIVERABLES.map((d) => (
                    <th key={d.id} scope="col" className="px-2 py-2 text-center ui-label text-muted">
                      {d.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {team.map((m) => (
                  <tr key={m.id} className="border-t border-line">
                    <th scope="row" className="py-3 pr-4 text-left font-normal text-ink-soft">
                      {m.name.value}
                    </th>
                    {DELIVERABLES.map((d) => {
                      const hit = m.deliverables.includes(d.id);
                      return (
                        <td key={d.id} className="px-2 py-3 text-center">
                          <span
                            className={`inline-grid h-6 w-6 place-items-center rounded-md ${
                              hit ? 'bg-neon text-neon-ink' : 'border border-line text-transparent'
                            }`}
                            aria-label={hit ? `${m.name.value} worked on ${d.label}` : ''}
                          >
                            {hit ? <Check size={14} aria-hidden="true" /> : '·'}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Section>
    </Page>
  );
}
