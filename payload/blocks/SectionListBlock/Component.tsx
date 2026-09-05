import type { SectionListBlock as SectionListBlockProps } from '@/payload-types';
import SectionList from '@/components/ui/SectionList';
import { HawkStarsSection } from '@/components/layout';

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
    <HawkStarsSection
      spacing='tight'
      padding='none'
      cap='none'
      container
      data-blockid='sectionListBlock'
    >
      <SectionList
        items={listItems}
        sectionId={sectionId ?? undefined}
        ordered={ordered ?? false}
      />
    </HawkStarsSection>
  );
};
