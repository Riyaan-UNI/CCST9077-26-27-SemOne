import { Link } from 'react-router-dom';
import { ArrowDown, ArrowRight, Clapperboard, FlaskConical, NotebookTabs } from 'lucide-react';
import Page from '@/components/Page';
import Qubi from '@/components/Qubi';
import VideoWall from '@/components/sections/VideoWall';
import EvidenceLedger from '@/components/cases/EvidenceLedger';
import PageDirectory from '@/components/PageDirectory';
import { bureauCases } from '@/content/cases';
import { useProgression } from '@/features/progression/ProgressionProvider';

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
                <strong>Three linked limits on information.</strong> Start with our video episodes,
                then investigate the quantum ideas with Qubi.
              </p>
              <p className="record-note registry-review-status">
                <span className="review-status-stamp">TEAM REVIEW</span>
                The team reviewed the science explanations for accuracy.
              </p>
              <div className="registry-actions mt-7">
                <a href="#videos" className="record-button">Watch the video episodes <ArrowDown size={16} aria-hidden="true" /></a>
                <Link to="/cases" className="record-text-link">Or explore the cases <ArrowRight size={15} aria-hidden="true" /></Link>
                <Link to="/cases" className="record-text-link" onClick={() => dispatch({ type: 'setObserverMode', value: true })}>Read without playing</Link>
                <Link to="#site-index" className="record-text-link">Explore all pages <ArrowRight size={15} aria-hidden="true" /></Link>
              </div>
              <div className="qubi-desk-note mt-9">
                <Qubi mood="curious" size={90} float={false} />
                <p><strong>Qubi, bureau guide</strong><br />“Let’s get entangled!”</p>
              </div>
            </div>

            <div className="registry-index visitor-route" aria-labelledby="registry-title">
              <div className="registry-index-head">
                <div>
                  <p className="record-kicker">A simple route / start anywhere</p>
                  <h2 id="registry-title">How to explore</h2>
                </div>
                <Clapperboard size={25} aria-hidden="true" />
              </div>
              <ol>
                <li><a href="#videos" className="registry-row"><span className="record-case-number">01</span><span className="registry-row-copy"><span className="record-topic">Watch</span><strong>Choose a video episode</strong></span><Clapperboard size={17} aria-hidden="true" /></a></li>
                <li><Link to="/cases" className="registry-row"><span className="record-case-number">02</span><span className="registry-row-copy"><span className="record-topic">Investigate</span><strong>Make a prediction and try a test</strong></span><FlaskConical size={17} aria-hidden="true" /></Link></li>
                <li><Link to="/ledger" className="registry-row"><span className="record-case-number">03</span><span className="registry-row-copy"><span className="record-topic">Compare</span><strong>Review the evidence ledger</strong></span><NotebookTabs size={17} aria-hidden="true" /></Link></li>
              </ol>
              <p className="registry-index-foot">Read in order—or follow whichever idea interests you.</p>
            </div>
          </div>
          <p className="registry-landing-index">Public Registry / Start here / {bureauCases.length} case files</p>
        </section>

        <section id="videos" className="record-section video-section" aria-labelledby="video-section-title">
          <div className="record-section-inner">
            <div className="record-section-heading">
              <div>
                <p className="record-kicker">Start here / the project’s main media</p>
                <h2 id="video-section-title">Watch the quantum episodes</h2>
                <p className="record-lead">Three team-made videos are ready to play. After each one, follow its case link to test the idea and read the finding.</p>
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

        <PageDirectory />
      </div>
    </Page>
  );
}
