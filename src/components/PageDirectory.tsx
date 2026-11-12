import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { pageGroups } from '@/data/pageIndex';

export default function PageDirectory() {
  let pageNumber = 0;

  return (
    <section id="site-index" className="record-section reference-section" aria-labelledby="site-index-title">
      <div className="record-section-inner">
        <p className="record-kicker">Site index / find your next stop</p>
        <h2 id="site-index-title">Explore all pages</h2>
        <p className="record-lead mt-3 max-w-3xl">
          Start with a case, try an activity, look up a term, or browse the project records.
        </p>
        <div className="mt-7 grid gap-8">
          {pageGroups.map((group, groupIndex) => (
            <section key={group.title} aria-labelledby={`site-index-group-${groupIndex}`}>
              <h3 id={`site-index-group-${groupIndex}`} className="mb-2 text-xl font-semibold">
                {group.title}
              </h3>
              <div className="reference-register">
                {group.pages.map((page) => {
                  pageNumber += 1;
                  return (
                    <Link key={page.href} to={page.href} className="reference-row">
                      <span className="record-case-number">{String(pageNumber).padStart(2, '0')}</span>
                      <span><strong>{page.label}</strong><small>{page.detail}</small></span>
                      <ArrowUpRight size={16} aria-hidden="true" />
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
