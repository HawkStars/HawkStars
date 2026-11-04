'use client';

import { HawkStarsSection } from '@/components/layout';
import { News } from '@/payload-types';
import { ImageMedia } from '@/payload/components/Media';
import { SocialIcon, SocialType } from '@/utils/models/social';
import { FC } from 'react';
import { useTranslation } from '@/i18n/client';
import { useLanguageCookie } from '@/utils/contexts/AppProvider';
import RichText from '@/payload/components/RichText';

type NewsSingleInformationProps = Pick<News, 'details' | 'references'>;

const NewsSingleInformation: FC<NewsSingleInformationProps> = ({ details, references }) => {
  const lng = useLanguageCookie();
  const { t } = useTranslation(lng, 'common');
  const { text } = details || {};
  return (
    <>
      {text && (
        <HawkStarsSection
          padding='none'
          cap='none'
          className='max-w-6xl flex-col py-6 lg:mx-auto lg:px-2 lg:py-12'
        >
          <RichText data={text} lng={lng} variant='article' />
          {references && references.length > 0 && (
            <div className='rt-column mt-12'>
              <h6 className='text-body_semibold text-green mb-4'>{t('sections.references')}</h6>
              {references.map((ref) => {
                const { platform, url, id } = ref || {};
                if (!url) return null;
                const icon = platform && SocialIcon[platform as SocialType];

                return (
                  <a
                    key={id}
                    href={url}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-green mb-1 flex gap-3'
                  >
                    {icon && (
                      <ImageMedia
                        src={icon}
                        alt={t('a11y.platformIcon', { platform })}
                        width={24}
                        height={24}
                      />
                    )}
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
