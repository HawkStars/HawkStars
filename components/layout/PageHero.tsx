import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Section } from './Section';
import { SectionEyebrow } from '@/components/ui/SectionHeader';

type PageHeroProps = {
  /** The heading — the page's single `h1` by default. Accepts nodes so part of it can be highlighted. */
  title: ReactNode;
  /** Small uppercase label above the title. */
  eyebrow?: string;
  description?: ReactNode;
  /** CTA row — pass `Button`s (use `inverse` / `outline-inverse` on the green variant). */
  actions?: ReactNode;
  /**
   * `green` — brand band with white text, for landing-style pages.
   * `bege` — light band with dark text, for listing and content pages.
   */
  variant?: 'green' | 'bege';
  align?: 'left' | 'center';
  /** `compact` for secondary pages (forms, legal) that only need a title strip. */
  size?: 'default' | 'compact';
  /** `h2` when reused as a mid/end-of-page banner — keep one `h1` per page. */
  as?: 'h1' | 'h2';
  /** Extra content rendered below the actions (filters, stats…). */
  children?: ReactNode;
  className?: string;
};

/**
 * The standard top-of-page header for org pages: one title scale, one gutter,
 * one vertical rhythm. Pages with a distinct sub-brand (Erasmus, gallery,
 * gaming, crowdfunding) keep their own heroes.
 */
export const PageHero = ({
  title,
  eyebrow,
  description,
  actions,
  variant = 'bege',
  align = 'left',
  size = 'default',
  as: Heading = 'h1',
  children,
  className,
}: PageHeroProps) => {
  const green = variant === 'green';
  const centered = align === 'center';

  return (
    <Section
      spacing={size === 'compact' ? 'tight' : 'default'}
      className={cn(
        'relative overflow-hidden',
        green ? 'bg-green text-white' : 'bg-bege-light text-black',
        className
      )}
    >
      {green && (
        <>
          <div className='pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-white/5' />
          <div className='pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/5' />
        </>
      )}

      <header
        className={cn(
          'relative flex flex-col',
          centered ? 'mx-auto max-w-3xl items-center text-center' : 'max-w-4xl'
        )}
      >
        {eyebrow && <SectionEyebrow label={eyebrow} variant={green ? 'inverse' : 'green'} />}
        <Heading className={cn('text-display', size === 'compact' && 'lg:text-5xl')}>
          {title}
        </Heading>
        {description && (
          <p
            className={cn(
              'mt-5 max-w-2xl text-lg leading-relaxed',
              green ? 'text-white/90' : 'text-black/70'
            )}
          >
            {description}
          </p>
        )}
        {actions && (
          <div className={cn('mt-8 flex flex-wrap gap-4', centered && 'justify-center')}>
            {actions}
          </div>
        )}
      </header>

      {children}
    </Section>
  );
};
