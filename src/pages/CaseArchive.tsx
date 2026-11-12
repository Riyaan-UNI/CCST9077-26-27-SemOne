import { Link } from 'react-router-dom';
import { ArrowUpRight, Check, LockKeyhole } from 'lucide-react';
import { bureauCases } from '@/content/cases';
import { videos } from '@/data/videos';
import Page from '@/components/Page';
import { useProgression } from '@/features/progression/ProgressionProvider';
import { useStore } from '@/store/useStore';

export default function CaseArchive() {
  const { progress } = useProgression();
  const entries = useStore((state) => state.caseLedger);
  const readableFindings = bureauCases.filter((item) => entries[item.id]?.findingRead).length;

  return (
    <Page>
      <div className="record-page mx-auto max-w-6xl px-5 pb-20 pt-28 sm:px-8">
        <p className="record-kicker">Bureau / public registry / case board</p>
        <h1 className="record-title mt-4 max-w-3xl">Three limits. Three different questions.</h1>
        <p className="record-lead mt-5 max-w-2xl">
          Choose any file. A folder’s progress marks what you have explored; every finding remains open to read.
          Orange means unresolved, blue means filed. <span className="metaphor-label">Metaphor</span> The red string is a reading guide between topics, not a physical connection.
        </p>
        <ol className="bureau-case-board mt-12" aria-label="Case files">
          {bureauCases.map((item, index) => {
            const related = videos.filter((video) => item.videoIds.includes(video.id));
            const isFiled = related.some((video) => progress.episodes[video.id]?.status === 'quizPassed');
            const isWatched = related.some((video) => ['watched', 'quizPassed'].includes(progress.episodes[video.id]?.status ?? ''));
            const isForthcoming = related.length > 0 && related.every((video) => video.status === 'coming-soon');
            const status = isFiled ? 'Filed' : isWatched ? 'In review' : isForthcoming ? 'Video forthcoming' : 'Unresolved';
            const Icon = isFiled ? Check : isForthcoming ? LockKeyhole : ArrowUpRight;
            const hasLinkedFinding = index === 0
              ? Boolean(entries.measurement?.findingRead && entries.entanglement?.findingRead)
              : index === 1 && Boolean(entries.entanglement?.findingRead && entries['no-cloning']?.findingRead);
            return (
              <li key={item.id} className={`bureau-case-folder${isForthcoming ? ' is-sealed' : ''}${hasLinkedFinding ? ' is-linked' : ''}`}>
                <Link to={`/cases/${item.id}`} aria-label={progress.observerMode ? `${item.topic}. Read case file.` : `${item.topic}. ${status}. Read case file.`}>
                  <span className="folder-topline"><span>CASE {item.number}</span>{!progress.observerMode && <span className={`folder-status progression-chrome${isFiled ? ' is-filed' : ''}`} title={isFiled ? 'Quiz complete and this file is filed.' : isWatched ? 'Video selected; the optional check remains.' : isForthcoming ? 'This video has not been released. The case can still be read.' : 'Watch the related video and try its optional check.'}>{isFiled && <Check size={13} aria-hidden="true" />}{status}</span>}</span>
                  <span className="folder-topic">{item.topic}</span>
                  <strong>{item.title}</strong>
                  <span className="folder-question">{item.question}</span>
                  <span className="folder-open">{isForthcoming ? 'Read anyway · video is forthcoming' : 'Open file'} {!progress.observerMode && <Icon size={15} aria-hidden="true" />}</span>
                </Link>
              </li>
            );
          })}
          <li className="bureau-case-folder bureau-conference-folder">
            <Link to="/ledger">
              <span className="folder-topline"><span>CASE CONFERENCE</span>{!progress.observerMode && <span className="folder-status progression-chrome">{readableFindings} / {bureauCases.length} findings read</span>}</span>
              <span className="folder-topic">Evidence ledger</span>
              <strong>Compare the findings together</strong>
              <span className="folder-question">Visit now for a preview, or return after reading the three findings.</span>
              <span className="folder-open">Open conference <ArrowUpRight size={15} aria-hidden="true" /></span>
            </Link>
          </li>
        </ol>
        {!progress.observerMode && <p className="record-note progression-chrome mt-6">Open any folder; the case reading path is never locked. The fourth episode remains forthcoming.</p>}
        <p className="record-note mt-2">Case summaries are working drafts for group science review.</p>
      </div>
    </Page>
  );
}
