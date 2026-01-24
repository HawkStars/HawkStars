import type { TitleDescriptionBlock as TitleDescriptionBlockProps } from '@/payload-types';

export const TitleDescriptionBlock: React.FC<TitleDescriptionBlockProps> = ({
  title,
  description,
  sectionId,
}) => {
  return (
    <section className='py-16 md:py-24' id={sectionId || undefined}>
      <div className='container mx-auto px-4'>
        <div className='flex flex-col items-center text-center'>
          {title && <h2 className='text-h2_bold tracking-tight'>{title}</h2>}
          {description && <p className='text-body_regular mt-4 max-w-4xl'>{description}</p>}
        </div>
      </div>
    </section>
  );
};
