import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check } from 'lucide-react';
import Page from '@/components/Page';
import Section from '@/components/Section';
import Qubi from '@/components/Qubi';
import { DELIVERABLES, team } from '@/content/team';
import { useStore } from '@/store/useStore';

function MemberCard({ member }: { member: (typeof team)[number] }) {
  const reduceMotion = useStore((s) => s.reduceMotion);
  const [open, setOpen] = useState(false);
  const pendingBio = member.funFact.value.includes('[Add');

  const expand = reduceMotion
    ? { duration: 0 }
    : { duration: 0.32, ease: [0.22, 1, 0.36, 1] as const };

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
            {member.fullName ? (
              <>
                {member.fullName}
                {member.location && (
                  <span className="ml-2 text-sm font-normal text-muted">· {member.location}</span>
                )}
              </>
            ) : (
              member.name.value
            )}
            {member.nickname && (
              <span className="ml-2 text-sm font-normal text-muted">“{member.nickname.value}”</span>
            )}
          </h3>
          <p className="font-hand text-lg text-neon">{member.title.value}</p>
          {pendingBio && (
            <p className="mt-1 text-xs text-hype-amber">
              Fun fact pending — placeholder shown
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
              <h4 className="ui-label text-neon">What {member.name.value} brought</h4>
              <ul className="mt-3 space-y-2 text-sm text-ink-soft">
                {member.contributions.map((c) => (
                  <li key={c.value} className="flex items-start gap-2">
                    <Check size={15} className="mt-0.5 shrink-0 text-neon" aria-hidden="true" />
                    <span>{c.value}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 rounded-lg border border-line bg-elevated px-4 py-3">
                <p className="text-xs text-muted">Bio</p>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft">{member.bio.value}</p>
              </div>
              <div className="mt-3 rounded-lg border border-line bg-elevated px-4 py-3">
                <p className="text-xs text-muted">Fun fact</p>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft">{member.funFact.value}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Team() {
  return (
    <Page>
      <Section
        eyebrow="The people"
        title="Three humans, one robot"
        lead="A small team that built this site. Tap a card to see what each person brought. Fun facts and short bios are placeholders — fill them in before submission."
      >
        <div className="grid gap-5 lg:grid-cols-3">
          {team.map((m) => (
            <MemberCard key={m.id} member={m} />
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
                            className={`inline-grid h-6 w-6 place-items-center rounded-md text-xs ${
                              hit
                                ? 'bg-neon/15 text-neon'
                                : 'border border-line text-muted'
                            }`}
                            aria-label={hit ? `${m.name.value} worked on ${d.label}` : `${m.name.value} did not work on ${d.label}`}
                          >
                            {hit ? <Check size={14} aria-hidden="true" /> : '—'}
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
