import { cn } from '@/lib/utils';
import SectionHeader, { type SectionHeaderVariant } from '@/components/ui/SectionHeader';

type SectionTitleProps = {
  title: string;
  sectionId: string;
  subtitle?: string;
  /** Small uppercase label above the title (the Erasmus section-header pattern). */
  eyebrow?: string;
  variant?: SectionHeaderVariant;
  className?: string;
};

/**
 * Bordered section title. Thin wrapper over `SectionHeader` so the divider
 * stays here and the type/eyebrow treatment lives in one place.
 */
const SectionTitle = ({
  title,
  sectionId,
  subtitle,
  eyebrow,
  variant = 'green',
  className,
}: SectionTitleProps) => (
  <SectionHeader
    title={title}
    eyebrow={eyebrow}
    subtitle={subtitle}
    sectionId={sectionId}
    variant={variant}
    className={cn('border-bege-dark border-b pb-4', className)}
    titleClassName='font-oswald text-2xl font-bold text-black lg:text-3xl'
    subtitleClassName='mt-1.5 text-sm text-black/70'
  />
);

export default SectionTitle;
