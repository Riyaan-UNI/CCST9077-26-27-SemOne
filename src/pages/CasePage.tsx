import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, FileText, Play, X } from 'lucide-react';
import Page from '@/components/Page';
import Qubi from '@/components/Qubi';
import EvidenceLedger from '@/components/cases/EvidenceLedger';
import CaseExperiment from '@/components/cases/CaseExperiment';
import { bureauCases, getBureauCase } from '@/content/cases';
import { videos } from '@/data/videos';
import { useStore } from '@/store/useStore';

type Stage = 'prediction' | 'test' | 'finding';

export default function CasePage() {
  const { caseId } = useParams();
  const item = getBureauCase(caseId);
  const entries = useStore((state) => state.caseLedger);
  const recordPrediction = useStore((state) => state.recordPrediction);
  const recordObservation = useStore((state) => state.recordObservation);
  const recordFindingRead = useStore((state) => state.recordFindingRead);
  const [prediction, setPrediction] = useState('');
  const [stage, setStage] = useState<Stage>('prediction');
  const [observation, setObservation] = useState('');
  const [confidence, setConfidence] = useState(() => item ? entries[item.id]?.confidence ?? 3 : 3);
  const [videoNudgeVisible, setVideoNudgeVisible] = useState(true);

  if (!item) {
    return (
      <Page>
        <div className="record-page mx-auto max-w-4xl px-5 pb-20 pt-28 sm:px-8">
          <p className="record-kicker">Archive lookup / no matching file</p>
          <h1 className="record-title mt-4">That case is not in this register.</h1>
          <Link className="record-link mt-8 inline-flex" to="/cases">Return to the case archive</Link>
        </div>
      </Page>
    );
  }

  const savedEntry = entries[item.id];
  const initialPrediction = prediction || savedEntry?.prediction || '';
  const currentIndex = bureauCases.findIndex((entry) => entry.id === item.id);
  const nextCase = bureauCases[(currentIndex + 1) % bureauCases.length];
  const relatedVideos = videos.filter((video) => item.videoIds.includes(video.id));

  const savePrediction = () => {
    if (!initialPrediction) return;
    recordPrediction(item.id, initialPrediction, confidence);
    setPrediction(initialPrediction);
    setStage('test');
  };

  const recordTestRun = (result: string) => {
    setObservation(result);
    recordObservation(item.id, result);
    recordFindingRead(item.id);
    setStage('finding');
  };

  return (
    <Page>
      <article className="record-page mx-auto max-w-6xl px-5 pb-24 pt-28 sm:px-8">
        <nav aria-label="Case location" className="record-breadcrumb">
          <Link to="/cases"><ArrowLeft size={15} aria-hidden="true" /> All cases</Link>
          <span> / Case {item.number}</span>
        </nav>

        <header className="record-case-header mt-8">
          <div>
            <p className="record-kicker">Case {item.number} / {item.topic}</p>
            <h1 className="record-title mt-4 max-w-4xl">{item.title}</h1>
            <p className="record-lead mt-5 max-w-3xl">{item.question}</p>
          </div>
          <div className="record-mascot-note">
            <Qubi mood="curious" size={104} float={false} />
            <p><strong>Qubi’s desk note</strong><br />A guided case. Make a prediction, run the test, then inspect the finding.</p>
          </div>
        </header>

        <ol className="case-progress progression-chrome mt-12" aria-label="Case steps">
          {(['prediction', 'test', 'finding'] as Stage[]).map((step, index) => {
            const active = step === stage;
            const complete = (['prediction', 'test', 'finding'] as Stage[]).indexOf(stage) > index;
            return (
              <li key={step} className={active ? 'is-active' : complete ? 'is-complete' : ''}>
                <span className="case-progress-number">{complete ? <Check size={15} aria-hidden="true" /> : `0${index + 1}`}</span>
                <span>{step}</span>
              </li>
            );
          })}
        </ol>

        <section className="case-step-panel mt-7" aria-labelledby="prediction-title">
          <div className="case-step-heading">
            <span className="record-case-number">01</span>
            <div>
              <p className="record-kicker">Prediction</p>
              <h2 id="prediction-title">Before the test, what do you expect?</h2>
            </div>
          </div>
          <p className="case-question">{item.predictionQuestion}</p>
          <fieldset className="prediction-options">
            <legend className="sr-only">Choose your prediction</legend>
            {item.predictions.map((choice, index) => (
              <label key={choice} className={initialPrediction === choice ? 'prediction-option is-selected' : 'prediction-option'}>
                <input
                  type="radio"
                  name={`prediction-${item.id}`}
                  value={choice}
                  checked={initialPrediction === choice}
                  onChange={() => setPrediction(choice)}
                />
                <span className="prediction-marker" aria-hidden="true">{String.fromCharCode(65 + index)}</span>
                <span>{choice}</span>
              </label>
            ))}
          </fieldset>
          <fieldset className="confidence-picker progression-chrome mt-5">
            <legend>How confident are you? <span className="record-muted">1 = guessing · 5 = very sure</span></legend>
            <div role="group" aria-label="Prediction confidence from 1 to 5">
              {[1, 2, 3, 4, 5].map((value) => (
                <button key={value} type="button" className={confidence === value ? 'is-selected' : ''} aria-pressed={confidence === value} onClick={() => setConfidence(value)}>{value}</button>
              ))}
            </div>
          </fieldset>
          {savedEntry?.prediction && !prediction && <p className="record-note">Your earlier prediction is saved on this device.</p>}
          <button type="button" className="record-button mt-5" disabled={!initialPrediction} onClick={savePrediction}>
            Save prediction <ArrowRight size={16} aria-hidden="true" />
          </button>
        </section>

        {stage !== 'prediction' && (
          <section className="case-step-panel mt-6" aria-labelledby="test-title">
            <div className="case-step-heading">
              <span className="record-case-number">02</span>
              <div>
                <p className="record-kicker">Test</p>
                <h2 id="test-title">{item.testLabel}</h2>
              </div>
            </div>
            <p className="case-question">{item.summary}</p>
            <CaseExperiment caseId={item.id} onRun={recordTestRun} />
            {observation && (
              <div className="case-test-output" aria-live="polite">
                <p className="record-kicker">Latest observation</p>
                <p className="case-observation" role="status">{observation}</p>
              </div>
            )}
          </section>
        )}

        {stage === 'finding' && (
          <section className="case-step-panel case-finding mt-6" aria-labelledby="finding-title">
            <div className="case-step-heading">
              <span className="record-case-number">03</span>
              <div>
                <p className="record-kicker">Finding / working draft</p>
                <h2 id="finding-title">What the case supports</h2>
              </div>
            </div>
            <p className="case-finding-text">{item.finding}</p>
            <div className="case-boundary mt-6">
              <p className="record-kicker">What this does not claim</p>
              <p>{item.boundary}</p>
            </div>
            <p className="record-note mt-5"><FileText size={14} aria-hidden="true" /> {item.lectureSource}</p>
            <Link to="/ledger" className="record-button mt-6">Add to case conference <ArrowRight size={16} aria-hidden="true" /></Link>
          </section>
        )}

        {stage === 'prediction' && (
          <details className="case-reader-path mt-5" onToggle={(event) => {
            if (event.currentTarget.open) {
              recordObservation(item.id, 'Read finding without running test.');
              recordFindingRead(item.id);
            }
          }}>
            <summary>Skip the test and read the working finding</summary>
            <p>{item.finding}</p>
            <p className="record-note">{item.boundary}</p>
          </details>
        )}

        {relatedVideos.some((video) => video.status === 'live') && videoNudgeVisible && (
          <aside className="case-related case-video-nudge mt-10" aria-labelledby="related-video-title">
            <button type="button" className="case-nudge-dismiss" onClick={() => setVideoNudgeVisible(false)} aria-label="Dismiss related video suggestion"><X size={17} aria-hidden="true" /></button>
            <p className="record-kicker">Qubi’s watch-along</p>
            <h2 id="related-video-title" className="mt-2">Have you watched the video version?</h2>
            <p className="case-nudge-copy">See how the group presents this idea, then return here to compare it with the interactive test.</p>
            <ul className="related-video-list mt-3">
              {relatedVideos.filter((video) => video.status === 'live').map((video) => (
                <li key={video.id}>
                  <Link to={`/videos?play=${encodeURIComponent(video.id)}`}>
                    <span>Episode {String(video.episode).padStart(2, '0')} · {video.title}</span>
                    <Play size={14} aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        )}

        <section className="mt-14" aria-labelledby="case-ledger-title">
          <div className="case-step-heading mb-5">
            <span className="record-case-number">↔</span>
            <div>
              <p className="record-kicker">Case conference</p>
              <h2 id="case-ledger-title">Compare this file with the others</h2>
            </div>
          </div>
          <EvidenceLedger />
        </section>

        <div className="case-next mt-12">
          <Link to={`/cases/${nextCase.id}`}><span>Next case / {nextCase.number}</span><strong>{nextCase.title}</strong><ArrowRight size={18} aria-hidden="true" /></Link>
        </div>
      </article>
    </Page>
  );
}
