import { Link } from 'react-router-dom';
import { GitBranch, Info } from 'lucide-react';
import Qubi from '@/components/Qubi';
import { isHkuBrand } from '@/config';
import { nav, site } from '@/data/site';

export default function Footer() {
  return (
    <footer className="relative mt-24 border-t border-line bg-surface">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-4">
            <Qubi mood="happy" size={72} float={false} />
            <div>
              <p className="font-display text-lg leading-tight">
                {site.mascot.name}{' '}
                <span className="text-sm font-normal text-muted">
                  · {site.mascot.pronunciation}
                </span>
              </p>
              <p className="font-hand text-xl text-neon">“{site.mascot.catchphrase}”</p>
            </div>
          </div>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted">
            {site.tagline}
          </p>
        </div>

        <nav aria-label="Footer">
          <h2 className="ui-label text-muted">Explore</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {nav.map((item) => (
              <li key={item.href}>
                <Link to={item.href} className="text-ink-soft transition hover:text-neon">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="ui-label text-muted">Project</h2>
          <ul className="mt-4 space-y-2 text-sm">
              <li className="flex items-center gap-2 text-ink-soft">
              <Info size={14} aria-hidden="true" />
              {isHkuBrand ? `${site.course} · ${site.faculty}` : 'A group project'}
            </li>
            <li className="flex items-center gap-2 text-ink-soft">
              <GitBranch size={14} aria-hidden="true" />
              Group project repository
            </li>
          </ul>
          <p className="mt-5 text-sm leading-relaxed text-muted">
            Built with React, Vite, TypeScript, Tailwind CSS, Motion, Radix UI, Recharts and a
            hand-written 3-qubit statevector simulator. All simulation runs locally in your browser.
          </p>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-5 py-5 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {site.course} group project · MIT licensed.</p>
          <p className="font-mono">
            |ψ⟩ = a|0⟩ + b|1⟩ · <span className="text-neon">|a|² + |b|² = 1</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
