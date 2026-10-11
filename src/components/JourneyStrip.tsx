import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface JourneyItem {
  href: string;
  label: string;
  blurb: string;
  tag: string;
}

/**
 * Horizontal, scroll-snapping preview strip used on the Home page to preview
 * the labs, timeline and other stops. Keyboard and screen-reader friendly: each
 * card is a real link, and the row scrolls natively (no JS scroll hijack).
 */
export default function JourneyStrip({ items }: { items: JourneyItem[] }) {
  return (
    <div className="relative -mx-5 px-5">
      {/* Right-edge fade gradient — signals there are more cards to the right */}
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-canvas to-transparent sm:w-20"
        aria-hidden="true"
      />
      {/* Small "scroll" hint at the top-right, visible until the user scrolls */}
      <p className="mb-2 flex items-center justify-end gap-1.5 text-xs text-muted sm:hidden">
        <ArrowRight size={12} className="animate-pulse" aria-hidden="true" />
        Swipe for more
      </p>
      <ul
        className={cn(
          'flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4',
          'scroll-smooth scrollbar-hidden',
        )}
      >
        {items.map((item) => (
          <li key={item.href} className="w-[78%] shrink-0 snap-start sm:w-72">
            <Link
              to={item.href}
              className="group flex h-full flex-col rounded-2xl border border-line bg-surface p-5 transition hover:border-line-strong hover:bg-elevated"
            >
              <span className="ui-label text-neon">{item.tag}</span>
              <h3 className="mt-2 flex items-center gap-1 text-lg">
                {item.label}
                <ArrowUpRight
                  size={16}
                  className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.blurb}</p>
            </Link>
          </li>
        ))}
        {/* Trailing empty card — provides padding so the last card can fully snap into view */}
        <li aria-hidden="true" className="w-2 shrink-0 sm:w-4" />
      </ul>
    </div>
  );
}
