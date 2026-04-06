import React from 'react';
import { getServerTranslation } from '@/i18n';
import { Language } from '@/i18n/settings';

type Props = { lng: Language };

const featureIcons = [
  <svg
    key='formacao'
    className='h-10 w-10'
    fill='none'
    stroke='currentColor'
    viewBox='0 0 24 24'
    strokeWidth={1.5}
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342'
    />
  </svg>,
  <svg
    key='coworking'
    className='h-10 w-10'
    fill='none'
    stroke='currentColor'
    viewBox='0 0 24 24'
    strokeWidth={1.5}
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21'
    />
  </svg>,
  <svg
    key='cultura'
    className='h-10 w-10'
    fill='none'
    stroke='currentColor'
    viewBox='0 0 24 24'
    strokeWidth={1.5}
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418'
    />
  </svg>,
  <svg
    key='gaming'
    className='h-10 w-10'
    fill='none'
    stroke='currentColor'
    viewBox='0 0 24 24'
    strokeWidth={1.5}
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 01-.657.643 48.491 48.491 0 01-4.163-.3c.186 1.613.468 3.176.85 4.69a.308.308 0 01-.426.35 2.108 2.108 0 01-.424-.26 48.306 48.306 0 00-4.94-.642.396.396 0 00-.278.67c1.142 1.209 2.63 2.283 4.413 3.033a.416.416 0 01.064.765A44.075 44.075 0 012.1 17.406a.43.43 0 00.148.788 49.238 49.238 0 005.07.475c.093.005.166.08.166.174v0a.414.414 0 01-.58.395A47.547 47.547 0 013.2 17.382a.402.402 0 00-.368.679c2.082 1.824 5.091 3.047 8.418 3.232a.405.405 0 00.277-.102c.178-.17.241-.443.143-.677A48.225 48.225 0 019.397 14.5c-.09-.264.095-.544.376-.544h4.454c.281 0 .466.28.376.544a48.292 48.292 0 00-2.273 6.014c-.098.234-.035.507.143.677a.405.405 0 00.277.102c3.327-.185 6.336-1.408 8.418-3.232a.402.402 0 00-.368-.679 47.547 47.547 0 01-3.704 1.856.414.414 0 01-.58-.395v0c0-.094.073-.169.166-.174a49.238 49.238 0 005.07-.475.43.43 0 00.148-.788 44.075 44.075 0 01-2.934-1.43.416.416 0 01.064-.765c1.783-.75 3.271-1.824 4.413-3.033a.396.396 0 00-.278-.67 48.306 48.306 0 00-4.94.642c-.155.094-.314.17-.424.26a.308.308 0 01-.426-.35c.382-1.514.664-3.077.85-4.69a48.491 48.491 0 01-4.163.3.64.64 0 01-.657-.643v0z'
    />
  </svg>,
  <svg
    key='comunidade'
    className='h-10 w-10'
    fill='none'
    stroke='currentColor'
    viewBox='0 0 24 24'
    strokeWidth={1.5}
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z'
    />
  </svg>,
  <svg
    key='reabilitacao'
    className='h-10 w-10'
    fill='none'
    stroke='currentColor'
    viewBox='0 0 24 24'
    strokeWidth={1.5}
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z'
    />
  </svg>,
] as const;

const featureKeys = [
  'formacao',
  'coworking',
  'cultura',
  'gaming',
  'comunidade',
  'reabilitacao',
] as const;

const CrowdfundingAbout = async ({ lng }: Props) => {
  const { t } = await getServerTranslation(lng, 'crowdfunding');

  return (
    <section className='w-full bg-[#0d0d0d] py-16'>
      <div className='mx-auto max-w-7xl px-4 lg:px-8'>
        <div className='mb-12 text-center'>
          <span className='flex items-center justify-center gap-2 text-xs font-semibold tracking-widest text-orange-500 uppercase'>
            <span className='inline-block h-2 w-2 rounded-full bg-orange-500' />
            {t('about.badge')}
          </span>
          <h2 className='font-oswald mt-4 text-3xl font-bold text-white lg:text-4xl'>
            {t('about.title')}
          </h2>
          <p className='mx-auto mt-4 max-w-3xl text-base leading-relaxed text-gray-400'>
            {t('about.description')}
          </p>
        </div>

        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6'>
          {featureKeys.map((key, index) => (
            <div
              key={key}
              className='flex flex-col items-center rounded-2xl border border-white/10 bg-[#1a1a1a] p-6 text-center transition hover:border-orange-500/30'
            >
              <div className='mb-4 text-orange-500'>{featureIcons[index]}</div>
              <h3 className='mb-2 text-sm font-bold text-white uppercase'>
                {t(`about.features.${key}.title`)}
              </h3>
              <p className='text-xs leading-relaxed text-gray-400'>
                {t(`about.features.${key}.description`)}
              </p>
            </div>
          ))}
        </div>

        <p className='mt-10 text-center text-base text-gray-400'>{t('about.tagline')}</p>
      </div>
    </section>
  );
};

export default CrowdfundingAbout;
