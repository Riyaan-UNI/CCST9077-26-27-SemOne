import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, CircleHelp, ClipboardList } from 'lucide-react';
import Page from '@/components/Page';
import Qubi from '@/components/Qubi';

export default function About() {
  return (
    <Page>
      <div className="record-page mx-auto max-w-5xl px-5 pb-20 pt-28 sm:px-8">
        <p className="record-kicker">Public record / how to use the archive</p>
        <h1 className="record-title mt-4 max-w-3xl">A case archive for quantum questions.</h1>
        <div className="mt-8 flex items-center gap-5 border-y border-line py-5">
          <Qubi mood="curious" size={90} float={false} />
          <p className="record-lead max-w-2xl">The Bureau is a fictional guide for exploring real ideas from CCST9077. “Lost-and-found” is a story frame; it does not mean quantum information has literally gone missing.</p>
        </div>
        <div className="about-record-list mt-10">
          <section><span><CircleHelp size={19} aria-hidden="true" /></span><div><h2>Make a prediction</h2><p>Each case starts with a question. Choose what you think the evidence will show, or skip straight to the working finding.</p></div></section>
          <section><span><ClipboardList size={19} aria-hidden="true" /></span><div><h2>Inspect the test</h2><p>Try a small browser-based demonstration. It illustrates a selected idea and does not represent every detail of a physical experiment.</p></div></section>
          <section><span><BookOpen size={19} aria-hidden="true" /></span><div><h2>Compare the finding</h2><p>The evidence ledger keeps the cases side by side while naming their different scientific limits.</p></div></section>
        </div>
        <Link to="/cases" className="record-button mt-9">Browse the case archive <ArrowRight size={16} aria-hidden="true" /></Link>
      </div>
    </Page>
  );
}
