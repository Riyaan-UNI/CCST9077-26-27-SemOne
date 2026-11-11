import { useState } from 'react';
import { ArrowRight, RotateCcw, Sparkles } from 'lucide-react';
import type { CaseId } from '@/content/cases';
import { createState, hadamard, measure, playChshClassical, playChshQuantum } from '@/quantum/simulator';

type Props = { caseId: CaseId; onRun: (observation: string) => void };
type ChshTrial = ReturnType<typeof playChshQuantum>;

export default function CaseExperiment({ caseId, onRun }: Props) {
  if (caseId === 'measurement') return <MeasurementExperiment onRun={onRun} />;
  if (caseId === 'entanglement') return <EntanglementExperiment onRun={onRun} />;
  return <CloningExperiment onRun={onRun} />;
}

function MeasurementExperiment({ onRun }: Pick<Props, 'onRun'>) {
  const [basis, setBasis] = useState<'Z' | 'X'>('Z');
  const [trials, setTrials] = useState<{ Z: number[]; X: number[] }>({ Z: [], X: [] });
  const outcomes = trials[basis];

  const measureShots = (count: number) => {
    const prep = hadamard(createState(1), 0); // |+> prepared on every trial
    const samples = Array.from({ length: count }, () => {
      const state = basis === 'X' ? hadamard(prep, 0) : prep;
      return measure(state).outcome;
    });
    const next = [...outcomes, ...samples].slice(-48);
    setTrials((current) => ({ ...current, [basis]: next }));
    const zero = next.filter((outcome) => outcome === 0).length;
    onRun(`${next.length} total ${basis}-basis measurements of separately prepared |+> states: ${zero} returned 0 and ${next.length - zero} returned 1. The pattern is a finite random sample.`);
  };

  const reset = () => setTrials((current) => ({ ...current, [basis]: [] }));
  const zeroCount = outcomes.filter((outcome) => outcome === 0).length;
  const oneCount = outcomes.length - zeroCount;

  return (
    <div className="experiment-console" aria-labelledby="measurement-console-title">
      <div className="experiment-console-head">
        <div><p className="record-kicker">Instrument / state analyzer</p><h3 id="measurement-console-title">Choose how to measure |+⟩</h3></div>
        <span className="experiment-live"><i aria-hidden="true" /> Ready</span>
      </div>
      <p className="experiment-instruction">Run the same preparation through different measurement settings. The state is prepared anew for each shot.</p>
      <fieldset className="experiment-choice-group">
        <legend>Measurement setting</legend>
        <label className={basis === 'Z' ? 'experiment-choice is-selected' : 'experiment-choice'}>
          <input type="radio" name="measurement-basis" checked={basis === 'Z'} onChange={() => setBasis('Z')} />
          <span className="experiment-choice-symbol">Z</span><span><strong>Read in Z basis</strong><small>Two possible outcomes for |+⟩</small></span>
        </label>
        <label className={basis === 'X' ? 'experiment-choice is-selected' : 'experiment-choice'}>
          <input type="radio" name="measurement-basis" checked={basis === 'X'} onChange={() => setBasis('X')} />
          <span className="experiment-choice-symbol">X</span><span><strong>Read in X basis</strong><small>|+⟩ is an eigenstate of this setting</small></span>
        </label>
      </fieldset>
      <div className="experiment-actions">
        <button type="button" className="record-button" onClick={() => measureShots(1)}>Measure once <ArrowRight size={15} aria-hidden="true" /></button>
        <button type="button" className="experiment-secondary" onClick={() => measureShots(12)}>Run 12 shots</button>
        <button type="button" className="experiment-reset" onClick={reset} disabled={!outcomes.length}><RotateCcw size={14} aria-hidden="true" /> Reset</button>
      </div>
      <div className="experiment-results" aria-live="polite">
        <div className="experiment-results-head"><strong>Detector tray</strong><span>{outcomes.length} / 48 displayed</span></div>
        {outcomes.length ? <ol className="measurement-sample" aria-label={`${outcomes.length} measurement outcomes`}>
          {outcomes.map((outcome, index) => <li key={`${index}-${outcome}`} className={outcome === 0 ? 'result-zero' : 'result-one'} aria-label={`Shot ${index + 1}: ${outcome}`}>{outcome}</li>)}
        </ol> : <p className="experiment-empty">Your readouts will appear here. Choose a setting and take a shot.</p>}
        <div className="case-visualizer-legend"><span><i className="result-dot result-zero" /> 0 · {zeroCount}</span><span><i className="result-dot result-one" /> 1 · {oneCount}</span></div>
      </div>
      <p className="experiment-footnote">This simulator samples the ideal state |+⟩. Real devices have noise; a small sample need not look exactly balanced.</p>
    </div>
  );
}

function EntanglementExperiment({ onRun }: Pick<Props, 'onRun'>) {
  const [strategy, setStrategy] = useState<'quantum' | 'classical'>('quantum');
  const [rounds, setRounds] = useState<ChshTrial[]>([]);
  const wins = rounds.filter((round) => round.win).length;
  const playRounds = (count: number) => {
    const simulate = strategy === 'quantum' ? playChshQuantum : playChshClassical;
    const next = [...rounds, ...Array.from({ length: count }, () => simulate())].slice(-24);
    setRounds(next);
    const score = next.filter((round) => round.win).length;
    onRun(`${strategy === 'quantum' ? 'Quantum' : 'Classical'} strategy: ${score} wins in the latest ${next.length} rounds. Sample scores vary from run to run; the ideal quantum and classical limits describe long-run averages.`);
  };

  return (
    <div className="experiment-console" aria-labelledby="chsh-console-title">
      <div className="experiment-console-head">
        <div><p className="record-kicker">Instrument / Bell game table</p><h3 id="chsh-console-title">Play the two-player challenge</h3></div>
        <span className="experiment-live"><i aria-hidden="true" /> No messages</span>
      </div>
      <p className="experiment-instruction">Each player gets a private random setting, then answers without communicating. Pick the pair’s strategy and compare the score.</p>
      <fieldset className="experiment-choice-group">
        <legend>Choose the players’ strategy</legend>
        <label className={strategy === 'quantum' ? 'experiment-choice is-selected' : 'experiment-choice'}>
          <input type="radio" name="chsh-strategy" checked={strategy === 'quantum'} onChange={() => setStrategy('quantum')} />
          <span className="experiment-choice-symbol">Q</span><span><strong>Entangled pair</strong><small>Ideal winning chance ≈ 85.4% per round</small></span>
        </label>
        <label className={strategy === 'classical' ? 'experiment-choice is-selected' : 'experiment-choice'}>
          <input type="radio" name="chsh-strategy" checked={strategy === 'classical'} onChange={() => setStrategy('classical')} />
          <span className="experiment-choice-symbol">C</span><span><strong>Shared classical rule</strong><small>This simple rule wins 3 of 4 setting pairs</small></span>
        </label>
      </fieldset>
      <div className="experiment-actions">
        <button type="button" className="record-button" onClick={() => playRounds(1)}>Play one round <ArrowRight size={15} aria-hidden="true" /></button>
        <button type="button" className="experiment-secondary" onClick={() => playRounds(12)}>Play 12 rounds</button>
        <button type="button" className="experiment-reset" onClick={() => setRounds([])} disabled={!rounds.length}><RotateCcw size={14} aria-hidden="true" /> Reset</button>
      </div>
      <div className="experiment-score" aria-live="polite">
        <div><span>Latest sample</span><strong>{wins}<small> / {rounds.length || 0}</small></strong></div>
        <div className="experiment-score-track" role="progressbar" aria-label="Wins in latest sample" aria-valuemin={0} aria-valuemax={rounds.length || 1} aria-valuenow={wins}><span style={{ width: `${rounds.length ? (wins / rounds.length) * 100 : 0}%` }} /></div>
        <p>{rounds.length ? `${Math.round((wins / rounds.length) * 100)}% won · this finite sample` : 'Play a round to start the scorecard.'}</p>
      </div>
      {rounds.length > 0 && <div className="chsh-game-board" aria-label="Recent game rounds">
        <div className="chsh-board-head"><span>Round</span><span>Settings x, y</span><span>Answers a, b</span><span>Score</span></div>
        <ol className="chsh-rounds">{rounds.map((round, index) => <li key={`${index}-${round.x}${round.y}${round.a}${round.b}`}><span>{String(index + 1).padStart(2, '0')}</span><span>{round.x}, {round.y}</span><span>{round.a}, {round.b}</span><strong className={round.win ? 'round-win' : 'round-loss'}>{round.win ? 'WIN' : 'MISS'}</strong></li>)}</ol>
      </div>}
      <p className="experiment-footnote">This is a local statistical simulation. A shared game score reveals correlations; the model does not send a controllable signal between players.</p>
    </div>
  );
}

function CloningExperiment({ onRun }: Pick<Props, 'onRun'>) {
  const [state, setState] = useState<'zero' | 'one' | 'plus'>('plus');
  const [mode, setMode] = useState<'known' | 'universal'>('universal');
  const [ran, setRan] = useState(false);
  const label = state === 'zero' ? '|0⟩' : state === 'one' ? '|1⟩' : '|+⟩';
  const runCopier = () => {
    setRan(true);
    const result = mode === 'known'
      ? `A preparer who knows the state ${label} can prepare that same state again. This is repeat preparation, not a universal unknown-state copier.`
      : state === 'plus'
        ? 'A copier built to copy |0⟩ and |1⟩ would map |+⟩ to (|00⟩ + |11⟩)/√2 by linearity—not to the independent pair |+⟩|+⟩.'
        : `This basis input ${label} is copied by this particular basis-copying rule. Passing this test does not prove it can copy every possible state.`;
    onRun(result);
  };

  return (
    <div className="experiment-console" aria-labelledby="cloning-console-title">
      <div className="experiment-console-head">
        <div><p className="record-kicker">Instrument / preparation bench</p><h3 id="cloning-console-title">Put the copier to the test</h3></div>
        <span className="experiment-live"><i aria-hidden="true" /> Input: {label}</span>
      </div>
      <p className="experiment-instruction">A copier can pass a familiar test and still fail as a universal device. Choose an input, then decide whether the machine knows its preparation.</p>
      <div className="experiment-state-picker" role="group" aria-label="Choose an input state">
        {[['zero', '|0⟩', 'Basis state'], ['one', '|1⟩', 'Basis state'], ['plus', '|+⟩', 'Superposition']].map(([id, symbol, description]) => (
          <button type="button" key={id} className={state === id ? 'state-pick is-selected' : 'state-pick'} onClick={() => { setState(id as typeof state); setRan(false); }} aria-pressed={state === id}>
            <strong>{symbol}</strong><span>{description}</span>
          </button>
        ))}
      </div>
      <fieldset className="experiment-choice-group">
        <legend>What does the machine know?</legend>
        <label className={mode === 'known' ? 'experiment-choice is-selected' : 'experiment-choice'}>
          <input type="radio" name="copy-mode" checked={mode === 'known'} onChange={() => { setMode('known'); setRan(false); }} />
          <span className="experiment-choice-symbol">R</span><span><strong>Repeat a known preparation</strong><small>The preparer knows which state to make</small></span>
        </label>
        <label className={mode === 'universal' ? 'experiment-choice is-selected' : 'experiment-choice'}>
          <input type="radio" name="copy-mode" checked={mode === 'universal'} onChange={() => { setMode('universal'); setRan(false); }} />
          <span className="experiment-choice-symbol">?</span><span><strong>Test one universal copier</strong><small>Same device must copy arbitrary unknown inputs</small></span>
        </label>
      </fieldset>
      <button type="button" className="record-button experiment-run" onClick={runCopier}><Sparkles size={15} aria-hidden="true" /> Run copier</button>
      <div className={`copy-machine${ran ? ' is-running' : ''}${mode === 'known' ? ' can-prepare' : ' unknown-input'}`} aria-live="polite">
        <div className="copy-machine-head"><strong>{ran ? (mode === 'known' ? 'Preparation repeated' : state === 'plus' ? 'Universal test failed' : 'Basis test passed') : 'Machine waiting'}</strong><span>{mode === 'known' ? 'Known recipe' : 'One rule for every state'}</span></div>
        <div className="copy-machine-flow"><span className="copy-state-chip">Input<br /><b>{label}</b></span><span className="copy-machine-gate" aria-hidden="true">{ran ? (mode === 'known' ? 'REMAKE' : state === 'plus' ? '≠' : 'COPY') : 'TEST'}</span><span className="copy-state-chip">{ran ? (mode === 'universal' && state === 'plus' ? 'Entangled pair' : `${label} + ${label}`) : 'Two outputs'}</span></div>
        {ran && mode === 'universal' && state === 'plus' && <p className="copy-equation"><b>Copier output:</b> (|00⟩ + |11⟩) / √2<br /><b>Perfect independent copies:</b> |+⟩|+⟩ = (|00⟩ + |01⟩ + |10⟩ + |11⟩) / 2</p>}
        <p>{ran ? (mode === 'known' ? 'Knowing a preparation lets you make another one; it does not reveal a completely unknown input.' : state === 'plus' ? 'The output differs from two independent copies. This example shows why a basis copier cannot extend to every unknown state.' : 'This one input is not enough to verify a universal copier; try the superposition input.') : 'Choose a state and machine setting, then run the test.'}</p>
      </div>
      <p className="experiment-footnote">No-cloning limits a universal perfect operation on arbitrary unknown states. It does not prevent preparing another copy when the state is known.</p>
    </div>
  );
}
