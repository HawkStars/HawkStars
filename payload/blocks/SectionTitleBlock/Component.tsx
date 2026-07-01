import type { SectionTitleBlock as SectionTitleBlockProps } from '@/payload-types';
import SectionTitle from '@/components/ui/SectionTitle';
import { HawkStarsSection } from '@/components/layout';

export const SectionTitleBlockComponent: React.FC<SectionTitleBlockProps> = ({
  title,
  subtitle,
  sectionId,
}) => {
  return (
    <HawkStarsSection spacing='tight' padding='none' container data-blockId='sectionTitleBlock'>
      <SectionTitle title={title} sectionId={sectionId ?? ''} subtitle={subtitle ?? undefined} />
    </HawkStarsSection>
  );
};
