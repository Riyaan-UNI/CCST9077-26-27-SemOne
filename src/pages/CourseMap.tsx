import { Link } from 'react-router-dom';
import { BookOpen, ExternalLink } from 'lucide-react';
import Page from '@/components/Page';
import Section from '@/components/Section';
import { courseParts } from '@/content/courseMap';

export default function CourseMap() {
  return (
    <Page>
      <Section
        eyebrow="The course"
        title="Course Map"
        lead="CCST9077 — The Quantum Revolution. Eleven lectures in three parts, week by week."
      >
        <div className="space-y-10">
          {courseParts.map((part) => (
            <div key={part.id}>
              <h2 className="text-2xl">{part.title}</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {part.lectures.map((lecture) => (
                  <article
                    key={lecture.id}
                    className="flex h-full flex-col rounded-2xl border border-line bg-surface p-5 transition hover:border-line-strong"
                  >
                    <div className="flex items-center gap-2">
                      <span className="ui-label text-neon">Week {lecture.week}</span>
                    </div>
                    <h3 className="mt-2 text-lg">{lecture.title}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">
                      {lecture.summary}
                    </p>
                    {lecture.id === 'l11' && (
                      <Link
                        to="/universe-computer"
                        className="mt-3 inline-flex items-center gap-1 text-sm text-neon underline-offset-2 hover:underline"
                      >
                        <ExternalLink size={14} aria-hidden="true" />
                        Explore the interactive
                      </Link>
                    )}
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {lecture.keyConcepts.map((c) => (
                        <span
                          key={c}
                          className="rounded-full border border-line bg-elevated px-2.5 py-1 text-xs text-muted"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-line bg-surface p-6">
          <div className="flex items-center gap-2">
            <BookOpen size={18} className="text-neon" aria-hidden="true" />
            <h3 className="text-lg">Assessment</h3>
          </div>
          <ul className="mt-4 space-y-2 text-sm text-ink-soft">
            <li>• 10% class participation</li>
            <li>• 30% two quizzes (lectures 1–4 and 5–8)</li>
            <li>• 20% individual midterm exam</li>
            <li>• 40% final creative project (group work allowed)</li>
          </ul>
          <p className="mt-4 text-sm text-muted">
            The course allows disclosed AI assistants for coding and copy-editing, but prohibits
            using AI to generate homework answers or assessment submissions.
          </p>
          <Link
            to="/credits"
            className="mt-4 inline-block text-sm text-neon underline-offset-2 hover:underline"
          >
            See full credits and AI-use disclosure
          </Link>
        </div>
      </Section>
    </Page>
  );
}
