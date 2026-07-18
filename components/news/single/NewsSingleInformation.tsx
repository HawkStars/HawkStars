import { HawkStarsSection } from '@/components/layout';
import { News } from '@/payload-types';
import RichTextWrapper from '@/payload/components/RichText/RichTextWrapper';
import { FC } from 'react';

type NewsSingleInformationProps = Pick<News, 'details' | 'references'>;

const NewsSingleInformation: FC<NewsSingleInformationProps> = ({ details, references }) => {
  const { text } = details || {};
  return (
    <>
      {text && (
        <HawkStarsSection padding='none' className='py-6 lg:py-12'>
          <div className='mx-auto max-w-4xl max-lg:flex max-lg:flex-col max-lg:gap-6 max-lg:px-3'>
            <RichTextWrapper data={text} />
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
    </>
  );
};

export default NewsSingleInformation;
