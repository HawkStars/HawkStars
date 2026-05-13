import Image from 'next/image';
import { CrowdfundingSetting, Media } from '@/payload-types';
import { TFunction } from 'i18next';

type Props = { t: TFunction<string, string> } & Pick<CrowdfundingSetting, 'supporters'>;

const tabKeys = ['godparents', 'partners', 'donors', 'community'] as const;
const tabIcons = ['★', '🤝', '❤', '👥'] as const;

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

const CrowdfundingPartners = ({ t, supporters }: Props) => {
  return (
    <section className='w-full bg-[#111111] py-16'>
      <div className='mx-auto max-w-7xl px-4 lg:px-8'>
        <div className='flex flex-col gap-10 lg:flex-row lg:items-start'>
          <div className='flex shrink-0 flex-col gap-4 lg:w-80'>
            <span className='flex items-center gap-2 text-xs font-semibold tracking-widest text-orange-500 uppercase'>
              <span className='inline-block h-2 w-2 rounded-full bg-orange-500' />
              {t('partners.badge')}
            </span>
            <h2 className='font-oswald text-2xl font-bold text-white lg:text-3xl'>
              {t('partners.title_prefix')}{' '}
              <span className='text-orange-500'>{t('partners.title_highlight')}</span>{' '}
              {t('partners.title_suffix')}
            </h2>
            <p className='text-sm leading-relaxed text-gray-400'>{t('partners.description')}</p>

            <div className='mt-2 flex flex-wrap gap-2'>
              {tabKeys.map((key, index) => (
                <span
                  key={key}
                  className='flex items-center gap-1.5 rounded-full border border-white/20 px-4 py-1.5 text-xs font-semibold text-white'
                >
                  <span className='text-orange-500'>{tabIcons[index]}</span>
                  {t(`partners.tabs.${key}`)}
                </span>
              ))}
            </div>
          </div>

          <div className='flex flex-1 flex-wrap justify-center gap-4 lg:justify-start'>
            {(supporters ?? []).length > 0 ? (
              supporters?.map((supporter) => {
                const logoMedia =
                  typeof supporter.logo === 'object' ? (supporter.logo as Media) : null;
                const logoUrl = logoMedia?.url ?? null;

                return (
                  <div
                    key={supporter.id}
                    className='flex h-32 w-44 shrink-0 flex-col items-center justify-center rounded-2xl border border-orange-500/30 bg-[#1a1a1a] p-4 text-center'
                  >
                    {logoUrl ? (
                      <Image
                        src={logoUrl}
                        alt={supporter.name}
                        width={48}
                        height={48}
                        className='mb-2 h-12 w-12 rounded-full object-cover'
                      />
                    ) : (
                      <div className='mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-orange-500/20 text-sm font-bold text-orange-500'>
                        {supporter.type === 'person' ? (
                          <svg
                            className='h-5 w-5'
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'
                            strokeWidth={1.5}
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              d='M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z'
                            />
                          </svg>
                        ) : (
                          <span>{getInitials(supporter.name)}</span>
                        )}
                      </div>
                    )}
                    <p className='text-sm font-bold text-white'>{supporter.name}</p>
                    {supporter.subname && (
                      <p className='mt-0.5 text-[10px] leading-tight text-gray-500'>
                        {supporter.subname}
                      </p>
                    )}
                  </div>
                );
              })
            ) : (
              <p className='text-sm text-gray-500'>{t('partners.no_supporters')}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CrowdfundingPartners;
