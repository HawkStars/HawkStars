import type { TitleDescriptionBlock as TitleDescriptionBlockProps } from '@/payload-types';

export const TitleDescriptionBlock: React.FC<TitleDescriptionBlockProps> = ({
  title,
  description,
  sectionId,
}) => {
  return (
    <section className='section' id={sectionId || undefined} data-blockId='titleDescriptionBlock'>
      <div className='section-container'>
        <div className='flex flex-col items-center text-center'>
          {title && <h2 className='text-h2_bold tracking-tight text-balance'>{title}</h2>}
          {title && <div className='bg-green mt-5 h-1 w-12 rounded-full' />}
          {description && (
            <p className='text-body_regular mt-6 max-w-4xl leading-relaxed text-gray-600'>
              {description}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};
