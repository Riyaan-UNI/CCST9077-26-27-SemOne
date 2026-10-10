import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import Reveal from '@/components/Reveal';

interface SectionProps {
  id?: string;
  eyebrow?: string;
  title?: string;
  lead?: string;
  children: ReactNode;
  className?: string;
  align?: 'left' | 'center';
}

export default function Section({
  id,
  eyebrow,
  title,
  lead,
  children,
  className,
  align = 'left',
}: SectionProps) {
  return (
    <section id={id} className={cn('scroll-mt-24 py-20 sm:py-24', className)}>
      <div className="mx-auto w-full max-w-6xl px-5">
        {(eyebrow || title || lead) && (
          <Reveal className={cn('max-w-3xl', align === 'center' && 'mx-auto text-center')}>
            {eyebrow && (
              <p className="ui-label text-neon">{eyebrow}</p>
            )}
            {title && (
              <h2 className="mt-3 text-3xl leading-tight sm:text-4xl md:text-5xl">{title}</h2>
            )}
            {lead && <p className="mt-4 text-base leading-relaxed text-ink-soft sm:text-lg">{lead}</p>}
          </Reveal>
        )}
        <div className={cn((eyebrow || title || lead) && 'mt-12')}>{children}</div>
      </div>
    </section>
  );
}
