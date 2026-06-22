import { HawkStarsSection } from '@/components/layout';
import { News } from '@/payload-types';
import { FC } from 'react';

type NewsSingleInformationProps = Pick<News, 'details' | 'references'>;

const NewsSingleInformation: FC<NewsSingleInformationProps> = ({ details, references }) => {
  const { text, sections } = details || {};
  return (
    <>
      {text && (
        <HawkStarsSection padding='none' className='py-6 lg:py-12'>
          <div className='mx-auto max-w-4xl max-lg:flex max-lg:flex-col max-lg:gap-6 max-lg:px-3'>
            <p className='text-body_regular leading-relaxed whitespace-pre-line text-gray-700'>
              {text}
            </p>
          </div>
          {references && references.length > 0 && (
            <div className='mx-auto mt-6 max-w-4xl max-lg:mx-4'>
              <h6 className='text-h6_bold text-green'>References</h6>
              {references.map((ref) => {
                if (!ref.url) return null;
                return (
                  <a
                    key={ref.id}
                    href={ref.url}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-green underline'
                  >
                    {ref.title || ref.url}
                  </a>
                );
              })}
            </div>
          )}
        </HawkStarsSection>
      )}

      {sections && sections.length > 0 && (
        <HawkStarsSection className='bg-bege-light py-12 lg:py-16'>
          <div className='mx-auto flex max-w-3xl flex-col gap-12'>
            {sections.map((section, i) => (
              <div key={i} className='relative flex gap-6'>
                {/* Section number accent */}
                <div className='hidden shrink-0 sm:block'>
                  <span className='text-green/10 font-serif text-6xl leading-none font-black select-none'>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>

                {/* Section content */}
                <div className='border-green/20 flex flex-col gap-3 border-l-2 pl-6'>
                  {section.title && <h2 className='text-h2_bold text-green'>{section.title}</h2>}
                  {section.text && (
                    <p className='text-body_regular leading-relaxed whitespace-pre-line text-gray-700'>
                      {section.text}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </HawkStarsSection>
      )}
    </>
  );
};

export default NewsSingleInformation;
