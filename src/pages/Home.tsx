import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, BookOpen, FileSearch } from 'lucide-react';
import Page from '@/components/Page';
import Qubi from '@/components/Qubi';
import VideoWall from '@/components/sections/VideoWall';
import EvidenceLedger from '@/components/cases/EvidenceLedger';
import { bureauCases } from '@/content/cases';
import { useProgression } from '@/features/progression/ProgressionProvider';

const REFERENCE_LINKS = [
  { href: '/lab', label: 'Reference Lab', detail: 'Run the simulator and CHSH game.' },
  { href: '/timeline', label: 'Course Timeline', detail: 'Trace the ideas across the course.' },
  { href: '/course-map', label: 'Lecture Map', detail: 'Browse the lecture connections.' },
  { href: '/gallery', label: 'Diagram Archive', detail: 'Inspect the project’s visual explainers.' },
  { href: '/glossary', label: 'Term Index', detail: 'Look up quantum vocabulary.' },
  { href: '/computer', label: 'Computer Desk', detail: 'Try the interactive quantum computer activity.' },
  { href: '/delight', label: 'Quick Checks', detail: 'Check common claims and misconceptions.' },
  { href: '/about', label: 'About the Bureau', detail: 'How to explore the archive and its case tests.' },
];

export default function Home() {
  const { dispatch } = useProgression();
  return (
    <Page>
      <div className="record-home">
        <section className="registry-landing" aria-labelledby="home-title">
          <div className="record-home-inner">
            <div className="registry-intro">
              <p className="record-kicker"><span className="registry-mark" aria-hidden="true">Q</span> Registrar’s Field Journal / CCST9077</p>
              <h1 id="home-title" className="record-title">Quantum Lost-and-Found Bureau</h1>
              <p className="record-lead">
                <strong>Three linked limits on information.</strong> Follow each case from a
                prediction through a test to its working finding.
              </p>
              <p className="record-note registry-review-status">
                <span className="review-status-stamp">TEAM REVIEW</span>
                Science explanations are drafts awaiting the group’s evidence review.
              </p>
              <div className="registry-actions mt-7">
                <Link to="/cases" className="record-button">Open the archive <ArrowRight size={16} aria-hidden="true" /></Link>
                <Link to="/cases" className="record-text-link" onClick={() => dispatch({ type: 'setObserverMode', value: true })}>Read without playing</Link>
              </div>
              <div className="qubi-desk-note mt-9">
                <Qubi mood="curious" size={90} float={false} />
                <p><strong>Qubi, bureau guide</strong><br />“Let’s get entangled!”</p>
              </div>
            </div>

            <div className="registry-index" aria-labelledby="registry-title">
              <div className="registry-index-head">
                <div>
                  <p className="record-kicker">Register / 001–{String(bureauCases.length).padStart(3, '0')}</p>
                  <h2 id="registry-title">Open cases</h2>
                </div>
                <FileSearch size={25} aria-hidden="true" />
              </div>
              <ol>
                {bureauCases.map((item) => (
                  <li key={item.id}>
                    <Link to={`/cases/${item.id}`} className="registry-row">
                      <span className="record-case-number">{item.number}</span>
                      <span className="registry-row-copy">
                        <span className="record-topic">{item.topic}</span>
                        <strong>{item.title}</strong>
                      </span>
                      <ArrowUpRight size={17} aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ol>
              <Link to="/cases" className="registry-index-foot">View full case archive <ArrowRight size={15} aria-hidden="true" /></Link>
            </div>
          </div>
          <p className="registry-landing-index">Public Registry / Start here / {bureauCases.length} files open</p>
        </section>

        <section id="videos" className="record-section video-section" aria-labelledby="video-section-title">
          <div className="record-section-inner">
            <div className="record-section-heading">
              <div>
                <p className="record-kicker">Moving evidence / watch with Qubi</p>
                <h2 id="video-section-title">The video records</h2>
                <p className="record-lead">Three episodes are ready to play. Episode four is marked as forthcoming.</p>
              </div>
              <Link to="/videos" className="record-text-link">All video records <ArrowRight size={15} aria-hidden="true" /></Link>
            </div>
            <VideoWall />
          </div>
        </section>

        <section className="record-section conference-section" aria-labelledby="ledger-home-title">
          <div className="record-section-inner">
            <div className="record-section-heading">
              <div>
                <p className="record-kicker">Case conference / compare findings</p>
                <h2 id="ledger-home-title">What did each file establish?</h2>
                <p className="record-lead">The cases share a subject—information—but ask distinct scientific questions.</p>
              </div>
              <Link to="/ledger" className="record-text-link">Open full ledger <ArrowRight size={15} aria-hidden="true" /></Link>
            </div>
            <EvidenceLedger />
          </div>
        </section>

        <section className="record-section reference-section" aria-labelledby="reference-title">
          <div className="record-section-inner">
            <p className="record-kicker">Supporting material / browse by interest</p>
            <h2 id="reference-title">More from the bureau</h2>
            <div className="reference-register mt-7">
              {REFERENCE_LINKS.map((item, index) => (
                <Link key={item.href} to={item.href} className="reference-row">
                  <span className="record-case-number">{String(index + 1).padStart(2, '0')}</span>
                  <span><strong>{item.label}</strong><small>{item.detail}</small></span>
                  <ArrowUpRight size={16} aria-hidden="true" />
                </Link>
              ))}
              <Link to="/team" className="reference-row">
                <span className="record-case-number">09</span>
                <span><strong>Meet the team</strong><small>The people behind the project and Qubi.</small></span>
                <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
            </div>
            <p className="record-note mt-6"><BookOpen size={14} aria-hidden="true" /> Site explanations are student-project drafts and are being reviewed against CCST9077 lecture material.</p>
          </div>
        </section>
      </div>
    </Page>
  );
}
