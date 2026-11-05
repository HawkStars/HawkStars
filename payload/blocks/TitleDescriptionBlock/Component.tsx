import type { TitleDescriptionBlock as TitleDescriptionBlockProps } from '@/payload-types';
import { HawkStarsSection } from '@/components/layout';
import SectionHeader from '@/components/ui/SectionHeader';

export const TitleDescriptionBlock: React.FC<TitleDescriptionBlockProps> = ({
  eyebrow,
  title,
  description,
  sectionId,
}) => {
  return (
    <HawkStarsSection
      spacing='default'
      padding='none'
      cap='none'
      container
      id={sectionId || undefined}
      data-blockid='titleDescriptionBlock'
    >
      {title && (
        <SectionHeader
          title={title}
          eyebrow={eyebrow ?? undefined}
          subtitle={description ?? undefined}
          align='center'
          subtitleClassName='mt-5 max-w-2xl text-lg whitespace-pre-line'
        />
      )}
    </HawkStarsSection>
  );
};
