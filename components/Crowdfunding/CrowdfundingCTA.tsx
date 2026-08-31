import { CrowdfundingSetting, Media } from '@/payload-types';
import { ShareButton } from './ShareButton';
import { TFunction } from 'i18next';

type Props = { t: TFunction<string, string> } & Pick<
  CrowdfundingSetting,
  'ctaImage' | 'supportUrl' | 'contactUrl'
>;

const CrowdfundingCTA = ({ ctaImage, supportUrl, contactUrl, t }: Props) => {
  const ctaImageUrl =
    typeof ctaImage === 'object' ? (ctaImage as Media)?.url : ctaImage || '/images/projects/8.jpeg';

  return (
    <section id='support' className='bg-crowdfunding-bg relative w-full overflow-hidden'>
      <div
        className='absolute inset-0 bg-cover bg-center opacity-40'
        style={{ backgroundImage: `url('${ctaImageUrl}')` }}
      />
      <div className='from-crowdfunding-bg via-crowdfunding-bg/60 to-crowdfunding-bg/80 absolute inset-0 bg-linear-to-t' />

      <div className='relative mx-auto max-w-7xl px-4 py-20 lg:px-8 lg:py-32'>
        <h2 className='font-oswald text-3xl font-bold text-white lg:text-5xl'>
          {t('cta.title_line1')}
          <br />
          <span className='text-orange-500'>{t('cta.title_highlight')}</span>
        </h2>
        <p className='mt-4 max-w-lg text-base leading-relaxed text-gray-300'>
          {t('cta.description')}
        </p>

        <div className='mt-8 flex flex-wrap gap-4'>
          <a
            href={supportUrl || '#support'}
            className='flex items-center gap-2 rounded-full bg-orange-700 px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-orange-600'
          >
            <svg className='h-4 w-4' fill='currentColor' viewBox='0 0 20 20'>
              <path d='M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z' />
            </svg>
            {t('cta.cta_support')}
          </a>
          <ShareButton label={t('cta.cta_share')} />
          {contactUrl && (
            <a
              target='_blank'
              href={`mailto:${contactUrl}`}
              rel='noopener noreferrer'
              className='flex items-center gap-2 rounded-full border border-white/30 px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10'
            >
              <svg
                className='h-4 w-4'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                strokeWidth={2}
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
                />
              </svg>
              {t('cta.cta_team')}
            </a>
          )}
        </div>
      </div>
    </section>
  );
};

export default CrowdfundingCTA;
