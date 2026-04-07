import type { SectionTitleBlock as SectionTitleBlockProps } from '@/payload-types';
import SectionTitle from '@/components/ui/SectionTitle';

export const SectionTitleBlockComponent: React.FC<SectionTitleBlockProps> = ({
  title,
  subtitle,
  sectionId,
}) => {
  return (
    <div className='mx-auto max-w-7xl px-4 py-6 lg:px-8'>
      <SectionTitle
        title={title}
        sectionId={sectionId ?? ''}
        subtitle={subtitle ?? undefined}
      />
    </div>
  );
};
