import * as Tooltip from '@radix-ui/react-tooltip';
import type { ReactNode } from 'react';
import { glossaryById } from '@/content/glossary';

interface TermProps {
  /** Glossary id, e.g. "qubit". */
  id: string;
  /** Override the visible text; defaults to the glossary term. */
  children?: ReactNode;
}

/**
 * Tap-to-define glossary word. First appearances of a course term on a page
 * should wrap it in <Term> so a visitor can learn the word in place. Keyboard
 * accessible (Radix handles focus + Enter/Space) and works with touch.
 */
export default function Term({ id, children }: TermProps) {
  const entry = glossaryById[id];

  if (!entry) return <>{children}</>;

  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <button type="button" className="term" aria-label={`Define ${entry.term}`}>
          {children ?? entry.term}
        </button>
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content className="term-tip" sideOffset={6}>
          <span className="block font-display text-base text-ink">{entry.term}</span>
          <span className="mt-1 block text-sm leading-relaxed text-ink-soft">{entry.plain}</span>
          <span className="mt-3 block text-xs uppercase tracking-[0.12em] text-muted">
            Source: {entry.source.source}
          </span>
          <Tooltip.Arrow className="fill-[var(--elevated)]" />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}
