import { BookOpen, Code2, Heart, Sparkles } from 'lucide-react';
import Page from '@/components/Page';
import { isHkuBrand } from '@/config';
import { site } from '@/data/site';

const ATTRIBUTIONS = [
  ['React', 'MIT'],
  ['Vite', 'MIT'],
  ['TypeScript', 'Apache-2.0'],
  ['Tailwind CSS', 'MIT'],
  ['Motion', 'MIT'],
  ['Radix UI', 'MIT'],
  ['Zustand', 'MIT'],
  ['lucide-react', 'ISC'],
  ['Recharts', 'MIT'],
  ['react-lite-youtube-embed', 'MIT'],
  ['Fontsource (Baloo 2, Inter, VT323, Caveat)', 'OFL-1.1'],
];

export default function Credits() {
  return (
    <Page>
      <div className="record-page mx-auto max-w-5xl px-5 pb-20 pt-28 sm:px-8">
        <p className="record-kicker">Public record / credits</p>
        <h1 className="record-title mt-4 max-w-3xl">Sources, tools, and authorship.</h1>
        <p className="record-lead mt-5 max-w-2xl">A student project connected to {site.course}. The group is responsible for reviewing the science, media, and code before submission.</p>

        <section className="credit-record mt-10" aria-labelledby="ai-statement-title">
          <h2 id="ai-statement-title"><Sparkles size={19} aria-hidden="true" /> AI-use statement</h2>
          <p>
            AI supported concept and copy brainstorming, review of supplied course materials, draft
            visual identity studies, a Figma mapping of the interface tokens, gallery plates, video thumbnails, and React/TypeScript coding. The group
            selected the direction and is responsible for revising draft content, verifying scientific
            claims, and testing the site before submission.
          </p>
          <p className="record-note">This statement should be updated if the group’s actual use of AI changes.</p>
        </section>

        <section className="credit-record mt-6" aria-labelledby="sources-title">
          <h2 id="sources-title"><BookOpen size={19} aria-hidden="true" /> Science sources</h2>
          <p>
            The group is checking the case drafts against the supplied CCST9077 lecture materials.
            The topic-to-lecture map below is a starting point; the group should confirm exact slides
            and add any other sources used for the final explanations after its science review.
          </p>
          <ul className="credit-source-list">
            <li><strong>Case 01:</strong> Lecture 2, <em>Entering the Quantum Realm</em> · superposition and measurement · slide references pending group review.</li>
            <li><strong>Case 02:</strong> Lecture 3, <em>Quantum Spookiness</em>, and Lecture 4, <em>Winning Games with Quantum Tricks</em> · entanglement, no-signalling, and CHSH · slide references pending group review.</li>
            <li><strong>Case 03:</strong> Lecture 2, <em>Entering the Quantum Realm</em> · no-cloning theorem · slide references pending group review.</li>
          </ul>
        </section>

        <section className="credit-record mt-6" aria-labelledby="software-title">
          <h2 id="software-title"><Code2 size={19} aria-hidden="true" /> Third-party software</h2>
          <p>Open-source packages and license information are maintained in the project manifest.</p>
          <ul className="credit-attribution-grid">
            {ATTRIBUTIONS.map(([name, license]) => <li key={name}><span>{name}</span><small>{license}</small></li>)}
          </ul>
        </section>

        <div className="credit-course-note mt-8">
          <Heart size={18} aria-hidden="true" />
          <p>
            {isHkuBrand
              ? `This is a student group project for ${site.course} at ${site.institution}; it is not an official publication.`
              : `This is a student group project inspired by ${site.course}. It is not affiliated with or endorsed by an institution.`}
          </p>
        </div>
      </div>
    </Page>
  );
}
