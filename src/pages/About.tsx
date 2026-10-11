import Page from '@/components/Page';
import Section from '@/components/Section';
import Qubi from '@/components/Qubi';
import { site } from '@/data/site';

const STACK = [
  ['Framework', 'React + Vite + TypeScript'],
  ['Styling', 'Tailwind CSS v4 with class-based theming'],
  ['Accessible UI', 'Radix UI primitives (dialogs, tabs, tooltips, switches)'],
  ['Motion', 'Motion — page transitions, scroll timeline, swipe cards'],
  ['State', 'Zustand — settings and Qubi’s reaction event bus'],
  ['Charts', 'Recharts — measurement histograms and win-rate convergence'],
  ['Gallery', 'react-photo-album + yet-another-react-lightbox'],
  ['Video', 'react-lite-youtube-embed (no-cookie facade)'],
  ['3D (lazy)', 'three.js + react-three-fiber for the Bloch sphere'],
  ['Fonts', 'Fontsource (Inter, Baloo 2, VT323, Caveat), self-hosted'],
  ['Quantum engine', 'Hand-written statevector simulator, tested with Vitest'],
  ['Deploy', 'Any static host — Vercel, Netlify, Cloudflare Pages, GitHub Pages'],
];

export default function About() {
  return (
    <Page>
      <Section
        eyebrow="About"
        title={`${site.course} · ${site.courseTitle}`}
        lead={`${site.courseSubtitle}. A Common Core course at ${site.institution} on how a century of quantum theory became an engineering discipline — and what it means for the codes that protect the internet.`}
      >
        <div className="mb-8 flex items-center justify-end">
          <Qubi mood="thinking" size={80} className="hidden shrink-0 sm:block" />
        </div>
        <div className="grid gap-10 lg:grid-cols-[1fr_20rem]">
          <div className="space-y-5 leading-relaxed text-ink-soft">
            <p>
              {site.mascot.name} — pronounced {site.mascot.pronunciation}, from{' '}
              <em>{site.mascot.from}</em> — is a {site.mascot.species.toLowerCase()} whose screen-face
              renders quantum states on demand: |0⟩, |1⟩, a superposition blur, a Bloch sphere, an
              entangled pair linked by a glowing line.
            </p>
            <p>
              It is a working co-host, not a logo. Following the model set by the Faculty of Science's
              own mascot programme, Qubi voices the questions viewers are silently asking, carries the
              analogies that make abstract ideas land, and gives the series a consistent face across
              every thumbnail, transition and end screen.
            </p>
            <p className="font-hand text-2xl text-neon">
              {site.mascot.catchphrases.map((c) => `“${c}”`).join('  ·  ')}
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              {Object.entries(site.palette).map(([name, hex]) => (
                <div
                  key={name}
                  className="flex items-center gap-3 rounded-xl border border-line bg-surface px-4 py-2.5"
                >
                  <span
                    className="h-6 w-6 rounded-md border border-line"
                    style={{ backgroundColor: hex }}
                    aria-hidden="true"
                  />
                  <span className="text-sm">
                    <span className="block capitalize text-ink">{name}</span>
                    <span className="block num text-sm text-muted">{hex}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-line bg-surface p-6">
            <Qubi mood="happy" size={200} className="mx-auto" />
            <dl className="mt-6 space-y-3 text-sm">
              <div>
                <dt className="ui-label text-muted">Species</dt>
                <dd className="text-ink-soft">{site.mascot.species}</dd>
              </div>
              <div>
                <dt className="ui-label text-muted">Role</dt>
                <dd className="text-ink-soft">Recurring co-host, explainer and series anchor</dd>
              </div>
              <div>
                <dt className="ui-label text-muted">Personality</dt>
                <dd className="text-ink-soft">Curious, witty, perpetually in superposition</dd>
              </div>
            </dl>
          </div>
        </div>
      </Section>

      <Section eyebrow="Under the hood" title="What this site is built with">
        <div className="overflow-hidden rounded-2xl border border-line">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Technology stack</caption>
            <tbody>
              {STACK.map(([label, value], i) => (
                <tr key={label} className={i % 2 ? 'bg-surface' : 'bg-elevated'}>
                  <th scope="row" className="w-48 px-5 py-3.5 align-top font-medium text-ink">
                    {label}
                  </th>
                  <td className="px-5 py-3.5 text-muted">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {[
            {
              title: 'Accessible by default',
              body: 'Every interactive control is keyboard reachable, dialogs trap focus, toggles expose their state, and decorative motion is disabled under prefers-reduced-motion.',
            },
            {
              title: 'Fast on a phone',
              body: 'Routes are code-split, the Bloch sphere and charts load lazily, video facades fetch nothing until clicked, and fonts are self-hosted.',
            },
            {
              title: 'Honest about the physics',
              body: 'The simulator is verified against closed-form results, and the hype-check cards grade claims rather than repeating them.',
            },
          ].map((c) => (
            <div key={c.title} className="rounded-2xl border border-line bg-surface p-5">
              <h3 className="text-lg">{c.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{c.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="Credits" title="Team & licensing">
        <div className="rounded-2xl border border-line bg-surface p-6 sm:p-8">
          <p className="leading-relaxed text-ink-soft">
            A {site.course} group project for {site.faculty}, {site.institution}. Code is MIT licensed;
            the mascot concept and gallery plates are original work created for this project.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            Third-party software is used under its own licence: MIT for React, Vite, Tailwind, Motion,
            Radix UI, Zustand, Recharts, three.js and react-three-fiber; ISC for canvas-confetti and
            lucide-react; OFL for the Fontsource typefaces. Every dependency is free and open source.
          </p>
        </div>
      </Section>
    </Page>
  );
}
