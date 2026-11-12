import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Page from '@/components/Page';
import Qubi from '@/components/Qubi';

export default function NotFound() {
  return (
    <Page>
      <section className="record-page mx-auto grid min-h-[70svh] max-w-5xl items-center gap-8 px-5 pb-20 pt-28 sm:grid-cols-[1fr_auto] sm:px-8" aria-labelledby="missing-title">
        <div>
          <p className="record-kicker">Archive lookup / no matching file</p>
          <h1 id="missing-title" className="record-title mt-4">This record is not in the register.</h1>
          <p className="record-lead mt-5 max-w-xl">The address may be outdated, or the file may not exist. Return to the Public Registry to continue exploring.</p>
          <Link to="/" className="record-button mt-7"><ArrowLeft size={16} aria-hidden="true" /> Public Registry</Link>
        </div>
        <Qubi mood="thinking" size={150} float={false} />
      </section>
    </Page>
  );
}
