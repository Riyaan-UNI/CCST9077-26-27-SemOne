import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, FileText, Play } from 'lucide-react';
import Page from '@/components/Page';
import Qubi from '@/components/Qubi';
import EvidenceLedger from '@/components/cases/EvidenceLedger';
import { bureauCases, getBureauCase } from '@/content/cases';
import { videos } from '@/data/videos';
import { useStore } from '@/store/useStore';
import { createState, hadamard, measure, playChshQuantum } from '@/quantum/simulator';

type Stage = 'prediction' | 'test' | 'finding';

function runTest(caseId: string) {
  if (caseId === 'measurement') {
    const samples = Array.from({ length: 24 }, () => measure(hadamard(createState(1), 0)).outcome);
    const zero = samples.filter((value) => value === 0).length;
    return `Sample of 24 prepared trials: ${zero} read |0⟩ and ${samples.length - zero} read |1⟩. Each run is random; this one sample can vary.`;
  }
  if (caseId === 'entanglement') {
    const trials = Array.from({ length: 48 }, () => playChshQuantum());
    const wins = trials.filter((trial) => trial.win).length;
    return `In this simulated sample, the quantum CHSH strategy won ${wins} of 48 rounds (${Math.round((wins / trials.length) * 100)}%). A game score measures correlations; it is not a message sent between the players.`;
  }
  return '';
}

export default function CasePage() {
  const { caseId } = useParams();
  const item = getBureauCase(caseId);
  const entries = useStore((state) => state.caseLedger);
  const recordPrediction = useStore((state) => state.recordPrediction);
  const recordObservation = useStore((state) => state.recordObservation);
  const [prediction, setPrediction] = useState('');
  const [stage, setStage] = useState<Stage>('prediction');
  const [observation, setObservation] = useState('');
  const [copyMode, setCopyMode] = useState<'known' | 'unknown'>('unknown');

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
    recordPrediction(item.id, initialPrediction);
    setPrediction(initialPrediction);
    setStage('test');
  };

  const runCaseTest = () => {
    const result = item.id === 'no-cloning'
      ? copyMode === 'known'
        ? 'When a state is known to the preparer, that preparation can be repeated to make another instance. This is not a universal copier for unknown inputs.'
        : 'For an arbitrary unknown input state, quantum theory rules out a universal operation that makes a perfect independent copy while preserving the original.'
      : runTest(item.id);
    setObservation(result);
    recordObservation(item.id, result);
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

        <ol className="case-progress mt-12" aria-label="Case steps">
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
            {item.id === 'no-cloning' && (
              <fieldset className="prediction-options">
                <legend className="case-question">Choose the situation to inspect:</legend>
                <label className={copyMode === 'known' ? 'prediction-option is-selected' : 'prediction-option'}>
                  <input type="radio" name="copy-mode" checked={copyMode === 'known'} onChange={() => setCopyMode('known')} />
                  <span className="prediction-marker" aria-hidden="true">A</span>
                  <span>A state known to the preparer</span>
                </label>
                <label className={copyMode === 'unknown' ? 'prediction-option is-selected' : 'prediction-option'}>
                  <input type="radio" name="copy-mode" checked={copyMode === 'unknown'} onChange={() => setCopyMode('unknown')} />
                  <span className="prediction-marker" aria-hidden="true">B</span>
                  <span>An arbitrary unknown input state</span>
                </label>
              </fieldset>
            )}
            <button type="button" className="record-button mt-5" onClick={runCaseTest}>
              <Play size={15} aria-hidden="true" /> Run case test
            </button>
            {observation && <p className="case-observation" role="status">{observation}</p>}
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
          <details className="case-reader-path mt-5">
            <summary>Skip the test and read the working finding</summary>
            <p>{item.finding}</p>
            <p className="record-note">{item.boundary}</p>
          </details>
        )}

        {relatedVideos.length > 0 && (
          <aside className="case-related mt-10" aria-labelledby="related-video-title">
            <p className="record-kicker">Related video record</p>
            <h2 id="related-video-title" className="mt-2">Watch with Qubi</h2>
            <ul className="related-video-list mt-3">
              {relatedVideos.map((video) => (
                <li key={video.id}>
                  <Link to={`/videos#${video.id}`}>
                    <span>{video.status === 'live' ? 'Episode' : 'Coming soon'} {String(video.episode).padStart(2, '0')} · {video.title}</span>
                    {video.status === 'live' && <Play size={14} aria-hidden="true" />}
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
