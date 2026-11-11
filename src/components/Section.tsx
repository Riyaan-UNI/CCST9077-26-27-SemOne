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
  headingLevel?: 1 | 2;
}

export default function Section({
  id,
  eyebrow,
  title,
  lead,
  children,
  className,
  align = 'left',
  headingLevel = 2,
}: SectionProps) {
  const Heading = headingLevel === 1 ? 'h1' : 'h2';
  return (
    <section id={id} className={cn('observatory-section scroll-mt-24 py-16 sm:py-20 lg:py-24', className)}>
      <div className="mx-auto w-full max-w-7xl px-5 lg:px-8">
        {(eyebrow || title || lead) && (
          <Reveal className={cn('section-heading max-w-3xl', align === 'center' && 'mx-auto text-center')}>
            {eyebrow && (
              <p className="orbit-label ui-label">{eyebrow}</p>
            )}
            {title && (
              <Heading className="mt-3 text-3xl leading-tight sm:text-4xl md:text-5xl">{title}</Heading>
            )}
            {lead && <p className="mt-4 text-base leading-relaxed text-ink-soft sm:text-lg">{lead}</p>}
          </Reveal>
        )}
        <div className={cn((eyebrow || title || lead) && 'mt-12')}>{children}</div>
      </div>
    </section>
  );
}
