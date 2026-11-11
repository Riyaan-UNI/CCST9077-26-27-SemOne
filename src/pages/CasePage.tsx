import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, FileText, Play, X } from 'lucide-react';
import Page from '@/components/Page';
import Qubi from '@/components/Qubi';
import EvidenceLedger from '@/components/cases/EvidenceLedger';
import { bureauCases, getBureauCase } from '@/content/cases';
import { videos } from '@/data/videos';
import { useStore } from '@/store/useStore';
import { createState, hadamard, measure, playChshQuantum } from '@/quantum/simulator';

type Stage = 'prediction' | 'test' | 'finding';

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
  const [videoNudgeVisible, setVideoNudgeVisible] = useState(true);
  const [measurementOutcomes, setMeasurementOutcomes] = useState<number[]>([]);
  const [chshRounds, setChshRounds] = useState<ReturnType<typeof playChshQuantum>[]>([]);

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
    let result: string;
    if (item.id === 'measurement') {
      const outcomes = Array.from({ length: 24 }, () => measure(hadamard(createState(1), 0)).outcome);
      setMeasurementOutcomes(outcomes);
      const zero = outcomes.filter((value) => value === 0).length;
      result = `Sample of 24 prepared trials: ${zero} read |0⟩ and ${outcomes.length - zero} read |1⟩. Each run is random; this one sample can vary.`;
    } else if (item.id === 'entanglement') {
      const rounds = Array.from({ length: 48 }, () => playChshQuantum());
      setChshRounds(rounds);
      const wins = rounds.filter((trial) => trial.win).length;
      result = `In this simulated sample, the quantum CHSH strategy won ${wins} of ${rounds.length} rounds (${Math.round((wins / rounds.length) * 100)}%). A game score measures correlations; it is not a message sent between the players.`;
    } else {
      result = copyMode === 'known'
        ? 'When a state is known to the preparer, that preparation can be repeated to make another instance. This is not a universal copier for unknown inputs.'
        : 'For an arbitrary unknown input state, quantum theory rules out a universal operation that makes a perfect independent copy while preserving the original.';
    }
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
            {observation && (
              <div className="case-test-output">
                <p className="case-observation" role="status">{observation}</p>
                {item.id === 'measurement' && measurementOutcomes.length > 0 && (
                  <div className="case-visualizer" role="group" aria-label="Measurement trial results">
                    <div className="case-visualizer-head"><strong>Measurement tray</strong><span>24 runs · this sample</span></div>
                    <ol className="measurement-sample" aria-label="The 24 trial outcomes">
                      {measurementOutcomes.map((outcome, index) => <li key={`${index}-${outcome}`} className={outcome === 0 ? 'result-zero' : 'result-one'} aria-label={`Trial ${index + 1}: result ${outcome}`}>{outcome}</li>)}
                    </ol>
                    <div className="case-visualizer-legend"><span><i className="result-dot result-zero" /> |0⟩ · {measurementOutcomes.filter((value) => value === 0).length}</span><span><i className="result-dot result-one" /> |1⟩ · {measurementOutcomes.filter((value) => value === 1).length}</span></div>
                  </div>
                )}
                {item.id === 'entanglement' && chshRounds.length > 0 && (
                  <div className="case-visualizer" role="group" aria-label="CHSH game rounds">
                    <div className="case-visualizer-head"><strong>Two-player game board</strong><span>48 independent rounds</span></div>
                    <div className="chsh-board-head"><span>Round</span><span>Settings x, y</span><span>Answers a, b</span><span>Score</span></div>
                    <ol className="chsh-rounds">
                      {chshRounds.map((round, index) => <li key={index}><span>{String(index + 1).padStart(2, '0')}</span><span>{round.x}, {round.y}</span><span>{round.a}, {round.b}</span><strong className={round.win ? 'round-win' : 'round-loss'}>{round.win ? 'WIN' : 'MISS'}</strong></li>)}
                    </ol>
                    <p className="case-visualizer-foot">The board compares answers after each round; no message travels between the players during play.</p>
                  </div>
                )}
                {item.id === 'no-cloning' && (
                  <div className={`copy-machine ${copyMode === 'known' ? 'can-prepare' : 'unknown-input'}`} role="group" aria-label="Copy-machine comparison">
                    <div className="copy-machine-head"><strong>{copyMode === 'known' ? 'Known preparation' : 'Arbitrary unknown input'}</strong><span>{copyMode === 'known' ? 'Can prepare again' : 'No universal perfect copier'}</span></div>
                    <div className="copy-machine-flow"><span className="copy-state-chip">Original state</span><span className="copy-machine-gate" aria-hidden="true">{copyMode === 'known' ? 'PREPARE' : '×'}</span><span className="copy-state-chip">{copyMode === 'known' ? 'New preparation' : 'Perfect copy unavailable'}</span></div>
                    <p>{copyMode === 'known' ? 'Recreating a known preparation is different from copying an arbitrary unknown state.' : 'The theorem limits a universal perfect operation; it does not forbid preparing another copy when the state is known.'}</p>
                  </div>
                )}
                <button type="button" className="case-rerun" onClick={runCaseTest}>Run another sample <ArrowRight size={15} aria-hidden="true" /></button>
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
          <details className="case-reader-path mt-5">
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
                  <Link to={`/videos#${video.id}`}>
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
