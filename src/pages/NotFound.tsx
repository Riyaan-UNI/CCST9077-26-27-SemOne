import { Link } from 'react-router-dom';
import { Home as HomeIcon } from 'lucide-react';
import Page from '@/components/Page';
import Qubi from '@/components/Qubi';

export default function NotFound() {
  return (
    <Page>
      <section className="relative grid min-h-[80svh] place-items-center overflow-hidden px-5 pt-24">
        <div className="absolute inset-0 grid-paper opacity-40" />
        <div className="relative text-center">
          <Qubi mood="dizzy" size={190} className="mx-auto" />
          <p className="mt-8 font-mono text-6xl text-neon text-glow">404</p>
          <h1 className="mt-4 text-3xl">This state does not exist</h1>
          <p className="mx-auto mt-3 max-w-md leading-relaxed text-muted">
            Qubi measured the address and it collapsed to nothing. The probability amplitude here is
            zero.
          </p>
          <Link
            to="/"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-neon px-5 py-3 font-semibold text-neon-ink transition hover:brightness-110"
          >
            <HomeIcon size={17} aria-hidden="true" />
            Back to the homepage
          </Link>
        </div>
      </section>
    </Page>
  );
}
