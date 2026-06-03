import type { SectionTitleBlock as SectionTitleBlockProps } from '@/payload-types';
import SectionTitle from '@/components/ui/SectionTitle';

export const SectionTitleBlockComponent: React.FC<SectionTitleBlockProps> = ({
  title,
  subtitle,
  sectionId,
}) => {
  return (
    <div className='section-tight section-container' data-blockId='sectionTitleBlock'>
      <SectionTitle
        title={title}
        sectionId={sectionId ?? ''}
        subtitle={subtitle ?? undefined}
      />
    </div>
  );
};
