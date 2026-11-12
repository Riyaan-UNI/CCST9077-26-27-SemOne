import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Map, X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import Qubi from '@/components/Qubi';
import { useStore } from '@/store/useStore';

const stops = [
  { path: '/', target: '#home-title', name: 'Public Registry', hint: 'Start here: the landing page introduces the archive and points to its main sections.' },
  { path: '/cases', target: '.bureau-case-board', name: 'Open Cases', hint: 'Choose a case and make a prediction before opening its test.' },
  { path: '/cases/measurement', target: '.case-step-panel', name: 'Measurement case', hint: 'Explore the measurement story, record a prediction, and run the sample.' },
  { path: '/cases/entanglement', target: '.case-step-panel', name: 'Entanglement case', hint: 'Compare the two-player game outcomes and inspect what the correlations mean.' },
  { path: '/cases/no-cloning', target: '.case-step-panel', name: 'No-cloning case', hint: 'Compare a known preparation with an arbitrary unknown input.' },
  { path: '/videos', target: '.bureau-video-record', name: 'Video Records', hint: 'Watch the group’s episodes. Captions and transcripts belong alongside each release.' },
  { path: '/ledger', target: '.ledger-wrap', name: 'Evidence Ledger', hint: 'Review predictions and observations saved in this browser.' },
  { path: '/lab', target: '.lab-console', name: 'Reference Lab', hint: 'Try the course-linked simulators and change their controls.' },
  { path: '/computer', target: 'main h1', name: 'Computer Desk', hint: 'Follow the interactive computer activity at your own pace.' },
  { path: '/universe-computer', target: 'main h1', name: 'Universe Computer', hint: 'Explore the project’s larger interactive computer experience.' },
  { path: '/delight', target: 'main h1', name: 'Quick Checks', hint: 'Check familiar quantum claims and discuss their limits.' },
  { path: '/timeline', target: 'main h1', name: 'Course Timeline', hint: 'Trace selected ideas across the course timeline.' },
  { path: '/course-map', target: 'main h1', name: 'Lecture Map', hint: 'See how the project links its cases to course material.' },
  { path: '/gallery', target: 'main h1', name: 'Diagram Archive', hint: 'Inspect the project’s visual explainers.' },
  { path: '/glossary', target: 'main h1', name: 'Term Index', hint: 'Look up unfamiliar vocabulary as you explore.' },
  { path: '/team', target: 'main h1', name: 'Meet the Team', hint: 'See the contributors and their stated project roles.' },
  { path: '/about', target: 'main h1', name: 'About the Bureau', hint: 'See how to explore the archive and how its pages, simulations, notes, and videos work.' },
  { path: '/credits', target: 'main h1', name: 'Sources and Credits', hint: 'Check the source list, asset credits, and AI-use statement.' },
];

export default function GuidedTour() {
  const active = useStore((state) => state.tourActive);
  const index = useStore((state) => state.tourIndex);
  const setIndex = useStore((state) => state.setTourIndex);
  const finish = useStore((state) => state.finishTour);
  const location = useLocation();
  const navigate = useNavigate();
  const reduceMotion = useStore((state) => state.reduceMotion);
  const [qubiPosition, setQubiPosition] = useState({ left: 16, top: 80 });
  const stop = stops[index];

  useEffect(() => {
    if (!active) return;
    const matchedIndex = stops.findIndex((item) => item.path === location.pathname);
    if (matchedIndex >= 0 && matchedIndex !== index) setIndex(matchedIndex);
  }, [active, index, location.pathname, setIndex]);

  useEffect(() => {
    if (!active || !stop) return;
    let target: HTMLElement | null = null;
    let settleTimer = 0;
    let firstFrame = 0;
    const updatePosition = () => {
      if (!target) return;
      const rect = target.getBoundingClientRect();
      let left = Math.max(8, Math.min(rect.left + Math.min(rect.width / 2, 32) - 24, window.innerWidth - 56));
      const hud = document.querySelector<HTMLElement>('.guided-tour')?.getBoundingClientRect();
      let top = Math.max(8, Math.min(rect.top - 54, window.innerHeight - 64));
      if (hud && top < hud.bottom && top + 56 > hud.top && left < hud.right && left + 56 > hud.left) {
        const rightSide = rect.right - 56;
        left = rightSide >= 8 && (rightSide >= hud.right || rightSide + 56 <= hud.left)
          ? rightSide
          : Math.max(8, Math.min(left, window.innerWidth - 56));
        top = Math.min(hud.bottom + 8, window.innerHeight - 64);
      }
      setQubiPosition((current) => Math.abs(current.left - left) < 2 && Math.abs(current.top - top) < 2 ? current : { left, top });
    };

    firstFrame = window.requestAnimationFrame(() => {
      target = document.querySelector<HTMLElement>(stop.target) ?? document.querySelector<HTMLElement>('main h1');
      if (!target) return;
      target.classList.add('guided-tour-target');
      const block = target.getBoundingClientRect().height > window.innerHeight * 0.42 ? 'end' : 'center';
      target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block, inline: 'nearest' });
      updatePosition();
      settleTimer = window.setTimeout(updatePosition, reduceMotion ? 0 : 500);
      window.addEventListener('scroll', updatePosition, { passive: true });
      window.addEventListener('resize', updatePosition);
    });
    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.clearTimeout(settleTimer);
      window.removeEventListener('scroll', updatePosition);
      window.removeEventListener('resize', updatePosition);
      target?.classList.remove('guided-tour-target');
    };
  }, [active, index, location.pathname, reduceMotion, stop]);

  if (!active || !stop) return null;
  const previous = () => {
    const nextIndex = Math.max(0, index - 1);
    setIndex(nextIndex);
    navigate(stops[nextIndex].path);
  };
  const next = () => {
    if (index === stops.length - 1) { finish(); return; }
    const nextIndex = index + 1;
    setIndex(nextIndex);
    navigate(stops[nextIndex].path);
  };

  return (
    <>
    <div className="tour-companion" aria-hidden="true" style={qubiPosition}><Qubi mood="excited" size={52} float={false} /></div>
    <aside className="guided-tour" aria-label="Qubi’s guided tour" aria-live="polite">
      <div className="tour-copy">
        <p className="record-kicker"><Map size={14} aria-hidden="true" /> Qubi’s route · {index + 1} / {stops.length}</p>
        <h2>{stop.name}</h2>
        <p>{stop.hint}</p>
        <div className="tour-progress" role="progressbar" aria-label="Tour progress" aria-valuemin={1} aria-valuemax={stops.length} aria-valuenow={index + 1}><span style={{ width: `${((index + 1) / stops.length) * 100}%` }} /></div>
        <div className="tour-actions">
          <button type="button" className="tour-icon-button" onClick={previous} disabled={index === 0} aria-label="Previous tour stop"><ArrowLeft size={17} aria-hidden="true" /></button>
          <button type="button" className="record-button" onClick={next}>{index === stops.length - 1 ? 'Finish tour' : 'Next place'} <ArrowRight size={16} aria-hidden="true" /></button>
          <button type="button" className="tour-skip" onClick={finish}><X size={15} aria-hidden="true" /> Exit tour</button>
        </div>
      </div>
    </aside>
    </>
  );
}
