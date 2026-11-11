import { useEffect } from 'react';
import { ArrowLeft, ArrowRight, Map, X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import Qubi from '@/components/Qubi';
import { useStore } from '@/store/useStore';

const stops = [
  { path: '/', name: 'Public Registry', hint: 'Start here: the landing page introduces the archive and points to its main sections.' },
  { path: '/cases', name: 'Open Cases', hint: 'Choose a case and make a prediction before opening its test.' },
  { path: '/cases/measurement', name: 'Measurement case', hint: 'Explore the measurement story, record a prediction, and run the sample.' },
  { path: '/cases/entanglement', name: 'Entanglement case', hint: 'Compare the two-player game outcomes and inspect what the correlations mean.' },
  { path: '/cases/no-cloning', name: 'No-cloning case', hint: 'Compare a known preparation with an arbitrary unknown input.' },
  { path: '/videos', name: 'Video Records', hint: 'Watch the group’s episodes. Captions and transcripts belong alongside each release.' },
  { path: '/ledger', name: 'Evidence Ledger', hint: 'Review predictions and observations saved in this browser.' },
  { path: '/lab', name: 'Reference Lab', hint: 'Try the course-linked simulators and change their controls.' },
  { path: '/computer', name: 'Computer Desk', hint: 'Follow the interactive computer activity at your own pace.' },
  { path: '/universe-computer', name: 'Universe Computer', hint: 'Explore the project’s larger interactive computer experience.' },
  { path: '/delight', name: 'Quick Checks', hint: 'Check familiar quantum claims and discuss their limits.' },
  { path: '/timeline', name: 'Course Timeline', hint: 'Trace selected ideas across the course timeline.' },
  { path: '/course-map', name: 'Lecture Map', hint: 'See how the project links its cases to course material.' },
  { path: '/gallery', name: 'Diagram Archive', hint: 'Inspect the project’s visual explainers.' },
  { path: '/glossary', name: 'Term Index', hint: 'Look up unfamiliar vocabulary as you explore.' },
  { path: '/team', name: 'Meet the Team', hint: 'See the contributors and their stated project roles.' },
  { path: '/about', name: 'About the Bureau', hint: 'See how to explore the archive and how its pages, simulations, notes, and videos work.' },
  { path: '/credits', name: 'Sources and Credits', hint: 'Check the source list, asset credits, and AI-use statement.' },
];

export default function GuidedTour() {
  const active = useStore((state) => state.tourActive);
  const index = useStore((state) => state.tourIndex);
  const setIndex = useStore((state) => state.setTourIndex);
  const finish = useStore((state) => state.finishTour);
  const location = useLocation();
  const navigate = useNavigate();
  const stop = stops[index];

  useEffect(() => {
    if (!active) return;
    const matchedIndex = stops.findIndex((item) => item.path === location.pathname);
    if (matchedIndex >= 0 && matchedIndex !== index) setIndex(matchedIndex);
  }, [active, index, location.pathname, setIndex]);

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
    <aside className="guided-tour" aria-label="Qubi’s guided tour" aria-live="polite">
      <div className="tour-qubi"><Qubi mood="excited" size={66} float={false} /></div>
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
  );
}
