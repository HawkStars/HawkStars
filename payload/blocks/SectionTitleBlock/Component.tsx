import type { SectionTitleBlock as SectionTitleBlockProps } from '@/payload-types';
import SectionTitle from '@/components/ui/SectionTitle';
import { HawkStarsSection } from '@/components/layout';

export const SectionTitleBlockComponent: React.FC<SectionTitleBlockProps> = ({
  eyebrow,
  title,
  subtitle,
  sectionId,
}) => {
  return (
    <HawkStarsSection
      spacing='tight'
      padding='none'
      cap='none'
      container
      data-blockid='sectionTitleBlock'
    >
      <SectionTitle
        title={title}
        eyebrow={eyebrow ?? undefined}
        sectionId={sectionId ?? ''}
        subtitle={subtitle ?? undefined}
      />
    </HawkStarsSection>
  );
};
