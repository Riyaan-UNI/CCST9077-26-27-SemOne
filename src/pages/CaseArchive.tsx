import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { bureauCases } from '@/content/cases';
import Page from '@/components/Page';

export default function CaseArchive() {
  return (
    <Page>
      <div className="record-page mx-auto max-w-6xl px-5 pb-20 pt-28 sm:px-8">
        <p className="record-kicker">Public archive / open cases</p>
        <h1 className="record-title mt-4 max-w-3xl">Three limits. Three different questions.</h1>
        <p className="record-lead mt-5 max-w-2xl">
          Start with a prediction, try the case test, then compare your expectation with the finding.
          The cases connect through information, but they do not share one mechanism.
        </p>
        <ol className="record-register mt-12">
          {bureauCases.map((item) => (
            <li key={item.id}>
              <Link to={`/cases/${item.id}`} className="record-case-row">
                <span className="record-case-number">{item.number}</span>
                <span className="min-w-0 flex-1">
                  <span className="record-topic">{item.topic}</span>
                  <span className="record-case-title">{item.title}</span>
                  <span className="record-summary">{item.question}</span>
                </span>
                <ArrowUpRight className="record-case-arrow" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ol>
        <p className="record-note mt-6">Case summaries are working drafts for group science review.</p>
      </div>
    </Page>
  );
}
