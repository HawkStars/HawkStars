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
    <div className='mx-auto max-w-7xl px-4 py-6 lg:px-8'>
      <SectionList
        items={listItems}
        sectionId={sectionId ?? undefined}
        ordered={ordered ?? false}
      />
    </div>
  );
};
