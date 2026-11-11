import { useEffect, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { ArrowRight, Eye, SkipForward, Volume2, VolumeX } from 'lucide-react';
import Qubi from '@/components/Qubi';
import { useStore } from '@/store/useStore';

type Scene = 'loading' | 'reveal' | 'measure';

export default function QuantumIntro() {
  const hydrated = useStore((state) => state.hasHydrated);
  const completeIntro = useStore((state) => state.completeIntro);
  const startTour = useStore((state) => state.startTour);
  const reduceMotion = useStore((state) => state.reduceMotion);
  const sound = useStore((state) => state.sound);
  const toggleSound = useStore((state) => state.toggleSound);
  const [scene, setScene] = useState<Scene>('loading');
  const [measured, setMeasured] = useState(false);
  const introComplete = useStore((state) => state.introComplete);

  useEffect(() => {
    if (!hydrated || introComplete) return;
    const timer = window.setTimeout(() => setScene('reveal'), reduceMotion ? 0 : 1150);
    return () => window.clearTimeout(timer);
  }, [hydrated, introComplete, reduceMotion]);

  if (!hydrated || introComplete) return null;

  const measureQubi = () => {
    if (sound) playImpactCue();
    setScene('measure');
  };

  return (
    <Dialog.Root open={hydrated && !introComplete} onOpenChange={(open) => { if (!open) completeIntro(); }}>
      <Dialog.Portal>
      <Dialog.Overlay className="quantum-intro-overlay" />
      <Dialog.Content className={`quantum-intro${reduceMotion ? ' is-static' : ''}`} aria-describedby="intro-description">
      <button type="button" className="intro-sound-toggle" onClick={toggleSound} aria-pressed={sound}>
        {sound ? <Volume2 size={17} aria-hidden="true" /> : <VolumeX size={17} aria-hidden="true" />}
        {sound ? 'Sound on' : 'Sound off'}
      </button>
      <div className="intro-stars" aria-hidden="true" />
      <div className="intro-black-hole" aria-hidden="true"><span /></div>
      <div className="intro-content">
        <Dialog.Description id="intro-description" className="sr-only">A short interactive introduction to the quantum project website. You can skip at any time.</Dialog.Description>
        <p className="intro-overline">CCST9077 · An interactive field guide</p>
        {scene === 'loading' ? (
          <div className="intro-loading" aria-live="polite">
            <Dialog.Title className="sr-only">Preparing the Quantum Realm</Dialog.Title>
            <span className="intro-loading-mark" aria-hidden="true">Q</span>
            <p className="intro-overline">Calibrating the quantum field guide…</p>
            <div className="intro-loading-track" aria-hidden="true"><span /></div>
            <button type="button" className="intro-skip" onClick={() => setScene('reveal')}>Skip loading</button>
          </div>
        ) : scene === 'reveal' ? (
          <>
            <Dialog.Title asChild><h1 id="intro-title">Welcome to<br /><span>the Quantum Realm</span></h1></Dialog.Title>
            <p className="intro-lead">A small signal has gone missing. Qubi is here to help you investigate what quantum information can—and cannot—do.</p>
            <div className="intro-qubi-wrap"><Qubi mood="curious" size={112} float={!reduceMotion} /></div>
            <p className="intro-caption">Meet Qubi · your guide through the archive</p>
            <div className="intro-actions">
              <button type="button" className="record-button" onClick={measureQubi}>Meet Qubi <ArrowRight size={16} aria-hidden="true" /></button>
              <button type="button" className="intro-skip" onClick={() => { completeIntro(); }}>Explore on my own <SkipForward size={15} aria-hidden="true" /></button>
            </div>
          </>
        ) : (
          <>
            <p className="intro-overline">A playful analogy · not a literal qubit</p>
            <Dialog.Title asChild><h1 id="intro-title">Qubi is in<br /><span>superposition</span></h1></Dialog.Title>
            <p className="intro-lead">Two translucent Qubis stand for possible outcomes in this teaching metaphor. Choose “measure” to reveal one playful outcome; a real qubit is not a character in two places.</p>
            <button
              type="button"
              className={`intro-measure${measured ? ' has-measured' : ''}`}
              onClick={() => setMeasured(true)}
              aria-label={measured ? 'Qubi has been measured' : 'Measure Qubi'}
              aria-pressed={measured}
            >
              <span className="intro-qubi-state intro-qubi-a"><Qubi mood={measured ? 'happy' : 'curious'} size={92} float={!reduceMotion && !measured} /></span>
              {!measured && <span className="intro-qubi-state intro-qubi-b" aria-hidden="true"><Qubi mood="thinking" size={92} float={!reduceMotion} /></span>}
              <span className="intro-measure-label">{measured ? 'Qubi resolved!' : 'Measure Qubi'}</span>
            </button>
            <p className="intro-caption" aria-live="polite">{measured ? 'One game outcome is now shown. Quantum measurement is a physical interaction, not a person simply looking.' : 'Tap, click, or focus Qubi and press Enter.'}</p>
            <div className="intro-actions">
              <button type="button" className="record-button" disabled={!measured} onClick={startTour}>Start the guided tour <ArrowRight size={16} aria-hidden="true" /></button>
              <button type="button" className="intro-skip" onClick={() => completeIntro()}>Skip intro <SkipForward size={15} aria-hidden="true" /></button>
            </div>
            <p className="intro-analogy-note"><Eye size={14} aria-hidden="true" /> This character animation is an analogy for learning, not a model of a qubit’s spatial position.</p>
          </>
        )}
      </div>
      </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function playImpactCue() {
  const AudioContextCtor = window.AudioContext;
  if (!AudioContextCtor) return;
  const context = new AudioContextCtor();
  const duration = 0.28;
  const buffer = context.createBuffer(1, Math.floor(context.sampleRate * duration), context.sampleRate);
  const channel = buffer.getChannelData(0);
  for (let index = 0; index < channel.length; index += 1) {
    channel[index] = (Math.random() * 2 - 1) * (1 - index / channel.length);
  }
  const source = context.createBufferSource();
  const filter = context.createBiquadFilter();
  const gain = context.createGain();
  source.buffer = buffer;
  filter.type = 'lowpass';
  filter.frequency.value = 720;
  gain.gain.setValueAtTime(0.075, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + duration);
  source.connect(filter).connect(gain).connect(context.destination);
  source.onended = () => { void context.close(); };
  source.start();
}
