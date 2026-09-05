import { Section } from './Section';

type ContentSectionProps = {
  children: React.ReactNode;
  className?: string;
  /** Vertical rhythm, from `Section`'s scale. */
  spacing?: 'none' | 'tight' | 'default' | 'loose';
};

/**
 * The site's standard content column: one gutter scale and one max width, so
 * every section shares a left edge at every breakpoint.
 *
 * Use this instead of reaching for `Section` directly. `Section`'s legacy
 * `padding='default'` (`px-4 xl:px-40`) and hand-rolled wrappers
 * (`container mx-auto max-w-6xl`, bare `px-6 lg:px-12`) each produced a
 * different edge, which is what left list pages misaligned with the sections
 * above them.
 */
export const ContentSection: React.FC<ContentSectionProps> = ({
  children,
  className,
  spacing = 'default',
}) => (
  <Section spacing={spacing} className={className}>
    {children}
  </Section>
);

export default ContentSection;
