import { cn } from '@/lib/utils';

/**
 * The section-header pattern first written for the Erasmus pages: a small
 * uppercase eyebrow preceded by a short rule, then the heading, then an
 * optional subtitle.
 *
 * `variant` picks the accent for the site area it renders in — the org site
 * uses the Hawk Stars green, the Erasmus pages keep their programme blue and
 * gold, and gaming/crowdfunding use their own accents.
 */
export type SectionHeaderVariant =
  'green' | 'blue' | 'gold' | 'gaming' | 'crowdfunding' | 'inverse';

const ACCENT: Record<SectionHeaderVariant, { text: string; rule: string }> = {
  green: { text: 'text-green', rule: 'bg-green' },
  blue: { text: 'text-erasmus-blue', rule: 'bg-erasmus-blue' },
  gold: { text: 'text-erasmus-gold', rule: 'bg-erasmus-gold' },
  gaming: { text: 'text-gaming-accent', rule: 'bg-gaming-accent' },
  crowdfunding: { text: 'text-erasmus-gold', rule: 'bg-erasmus-gold' },
  inverse: { text: 'text-white', rule: 'bg-white' },
};

const HEADING_CLASS = {
  h1: 'text-h1_semibold',
  h2: 'text-h2_bold',
  h3: 'text-h2_light',
} as const;

/**
 * The eyebrow alone, for layouts that place the label separately from the
 * heading (hero blocks, split sections). Prefer `SectionHeader` when the label
 * and heading sit together.
 */
export const SectionEyebrow = ({
  label,
  variant = 'green',
  className,
}: {
  label: string;
  variant?: SectionHeaderVariant;
  className?: string;
}) => (
  <p
    className={cn(
      'mb-3 flex items-center gap-2.5 text-[0.7rem] font-bold tracking-[0.22em] uppercase',
      ACCENT[variant].text,
      className
    )}
  >
    <span className={cn('block h-0.5 w-7', ACCENT[variant].rule)} />
    {label}
  </p>
);

type SectionHeaderProps = {
  /** Heading text. */
  title: string;
  /** Small uppercase label above the title. Omit for a bare heading. */
  eyebrow?: string;
  /** Supporting line below the title. */
  subtitle?: string;
  /** Heading level — one `h1` per page; sections default to `h2`. */
  as?: keyof typeof HEADING_CLASS;
  align?: 'left' | 'center';
  /** Anchor id, for in-page navigation. */
  sectionId?: string;
  variant?: SectionHeaderVariant;
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
};

const SectionHeader = ({
  title,
  eyebrow,
  subtitle,
  as = 'h2',
  align = 'left',
  sectionId,
  variant = 'green',
  className,
  titleClassName,
  subtitleClassName,
}: SectionHeaderProps) => {
  const Heading = as;
  const centered = align === 'center';

  return (
    <div
      id={sectionId || undefined}
      className={cn('flex flex-col', centered && 'items-center text-center', className)}
    >
      {eyebrow ? (
        <SectionEyebrow label={eyebrow} variant={variant} />
      ) : (
        // No label to show (most CMS-driven sections have no eyebrow field yet),
        // so keep the accent rule alone rather than dropping the pattern.
        <span className={cn('mb-3 block h-0.5 w-7', ACCENT[variant].rule)} />
      )}
      <Heading className={cn(HEADING_CLASS[as], 'tracking-tight text-balance', titleClassName)}>
        {title}
      </Heading>
      {subtitle && (
        <p
          className={cn(
            'text-body_regular mt-4 max-w-4xl leading-relaxed text-black/70',
            subtitleClassName
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;
