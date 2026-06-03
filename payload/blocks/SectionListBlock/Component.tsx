import type { SectionListBlock as SectionListBlockProps } from '@/payload-types';
import SectionList from '@/components/ui/SectionList';

export const SectionListBlockComponent: React.FC<SectionListBlockProps> = ({
  items,
  ordered,
  sectionId,
}) => {
  const listItems = (items ?? []).map((item) => ({
    label: item.label,
    description: item.description ?? undefined,
  }));

  return (
    <div className='section-tight section-container' data-blockId='sectionListBlock'>
      <SectionList
        items={listItems}
        sectionId={sectionId ?? undefined}
        ordered={ordered ?? false}
      />
    </div>
  );
};
