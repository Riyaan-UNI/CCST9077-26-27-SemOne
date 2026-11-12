import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check } from 'lucide-react';
import Page from '@/components/Page';
import Qubi from '@/components/Qubi';
import { DELIVERABLES, team } from '@/content/team';
import { useStore } from '@/store/useStore';

function MemberCard({
  member,
  open,
  onToggle,
}: {
  member: (typeof team)[number];
  open: boolean;
  onToggle: () => void;
}) {
  const reduceMotion = useStore((s) => s.reduceMotion);
  const expand = reduceMotion
    ? { duration: 0 }
    : { duration: 0.32, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <article className="team-member-record h-fit self-start">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={`member-details-${member.id}`}
        className="flex w-full items-center gap-4 p-5 text-left transition hover:bg-elevated"
      >
        <Qubi mood={member.deliverables.includes('mascot') ? 'happy' : 'curious'} size={64} float={false} />
        <div className="min-w-0">
          <h3 className="text-xl">
            {member.fullName ? (
              <>
                {member.fullName}
              </>
            ) : (
              member.name
            )}
            {member.nickname && (
              <span className="ml-2 text-sm font-normal text-muted">“{member.nickname}”</span>
            )}
          </h3>
          <p className="mt-1 text-sm font-semibold text-neon">{member.title}</p>
        </div>
        <span className="ml-auto hidden text-sm text-muted sm:block">{open ? 'Close' : 'Open'}</span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`member-details-${member.id}`}
            role="region"
            aria-label={`${member.name} contributions and quantum fact`}
            initial={reduceMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={expand}
            className="overflow-hidden"
          >
            <div className="border-t border-line p-5">
              <h4 className="ui-label text-neon">What {member.name} brought</h4>
              <ul className="mt-3 space-y-2 text-sm text-ink-soft">
                {member.contributions.map((contribution) => (
                  <li key={contribution} className="flex items-start gap-2">
                    <Check size={15} className="mt-0.5 shrink-0 text-neon" aria-hidden="true" />
                    <span>{contribution}</span>
                  </li>
                ))}
              </ul>
              <div className="team-fun-fact mt-4 border border-line bg-elevated px-4 py-3">
                <p className="text-xs text-muted">Quantum fact · group review pending</p>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft">{member.funFact.text}</p>
                <a
                  className="team-fun-fact-source mt-3 block break-words text-sm text-cyan underline underline-offset-4"
                  href={member.funFact.reference.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Reference: {member.funFact.reference.label}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}

export default function Team() {
  const [openMemberId, setOpenMemberId] = useState<string | null>(null);

  return (
    <Page>
      <div className="record-page mx-auto max-w-6xl px-5 pb-20 pt-28 sm:px-8">
        <p className="record-kicker">Project record / group contributions</p>
        <h1 className="record-title mt-4 max-w-3xl">Four students. Qubi on the desk.</h1>
        <p className="record-lead mt-5 max-w-2xl">The roles below reflect what the group has supplied so far. Each quantum fact is a draft awaiting the group’s science review.</p>
        <div
          data-testid="team-member-grid"
          className="team-member-grid mt-10 grid auto-rows-min grid-cols-1 content-start items-start gap-5 md:grid-cols-2 xl:grid-cols-4"
        >
          {team.map((m) => (
            <MemberCard
              key={m.id}
              member={m}
              open={openMemberId === m.id}
              onToggle={() => setOpenMemberId((current) => (current === m.id ? null : m.id))}
            />
          ))}
        </div>

        <div className="team-contribution-register mt-14">
          <h2>Contribution register</h2>
          <p>Marks indicate the deliverables currently recorded for each member. The group should verify the record before submission.</p>

          <div className="mt-6 overflow-x-auto">
            <table className="team-register-table w-full border-collapse text-sm" style={{ minWidth: '28rem' }}>
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
                      {m.name}
                    </th>
                    {DELIVERABLES.map((d) => {
                      const hit = m.deliverables.includes(d.id);
                      return (
                        <td key={d.id} className="px-2 py-3 text-center">
                          <span
                            role="img"
                            className={`inline-grid h-6 w-6 place-items-center rounded-md text-xs ${
                              hit
                                ? 'bg-neon/15 text-neon'
                                : 'border border-line text-muted'
                            }`}
                            aria-label={hit ? `${m.name} worked on ${d.label}` : `${m.name} did not work on ${d.label}`}
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
      </div>
    </Page>
  );
}
