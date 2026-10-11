import { Link } from 'react-router-dom';
import Page from '@/components/Page';
import Section from '@/components/Section';
import Qubi from '@/components/Qubi';

/** Reusable "this stop lands in a later phase" placeholder. */
export default function ComingSoon({ title, blurb }: { title: string; blurb: string }) {
  return (
    <Page>
      <Section eyebrow="Coming soon" title={title} lead={blurb}>
        <div className="flex flex-col items-center gap-6 rounded-2xl border border-dashed border-line bg-surface/60 p-12 text-center">
          <Qubi mood="thinking" size={120} />
          <p className="max-w-md text-muted">
            This stop is part of a later phase. Phase 1 delivered the foundation, the home page, the
            videos, the team and the credits. It will grow from here.
          </p>
          <Link
            to="/"
            className="rounded-xl border border-line-strong px-4 py-2.5 text-sm font-semibold transition hover:border-neon hover:text-neon"
          >
            Back to home
          </Link>
        </div>
      </Section>
    </Page>
  );
}
