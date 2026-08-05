'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { SITE_GET_URLS, transformUrl } from '@/utils/paths';
import type { Language } from '@/i18n/settings';
import { languages, fallbackLng } from '@/i18n/settings';
import { useTranslation } from '@/i18n/client';

function detectLanguage(pathname: string): Language {
  const segment = pathname.split('/')[1];
  if (segment && languages.includes(segment as Language)) {
    return segment as Language;
  }
  return fallbackLng;
}

export default function NotFound() {
  const pathname = usePathname();
  const lng = detectLanguage(pathname);
  const { t } = useTranslation(lng, 'common');

  return (
    <main className='bg-bege-light relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center'>
      {/* Castle silhouette scene at bottom with hawk flying above */}
      <div aria-hidden='true' className='pointer-events-none absolute inset-0'>
        {/* Hawk soaring */}
        <svg
          viewBox='0 0 120 40'
          className='text-green absolute top-[18%] left-1/2 w-24 -translate-x-1/2 animate-[soar_6s_ease-in-out_infinite] opacity-[0.08] sm:top-[15%] sm:w-32'
          fill='currentColor'
        >
          <path d='M60 20 C50 10, 30 2, 0 8 C20 12, 40 16, 55 20 L60 22 L65 20 C80 16, 100 12, 120 8 C90 2, 70 10, 60 20Z' />
        </svg>

        {/* Castle silhouette — anchored to bottom */}
        <svg
          viewBox='0 0 1200 320'
          preserveAspectRatio='xMidYMax slice'
          className='text-green absolute bottom-0 left-0 h-55 w-full opacity-[0.05] sm:h-70'
          fill='currentColor'
        >
          {/* Ground */}
          <rect x='0' y='280' width='1200' height='40' />

          {/* Left tower */}
          <rect x='140' y='120' width='60' height='160' />
          <rect x='130' y='110' width='80' height='16' />
          {/* Battlements left tower */}
          <rect x='130' y='96' width='14' height='18' />
          <rect x='152' y='96' width='14' height='18' />
          <rect x='174' y='96' width='14' height='18' />
          <rect x='196' y='96' width='14' height='18' />

          {/* Left-center tower (tall) */}
          <rect x='320' y='60' width='50' height='220' />
          <rect x='310' y='50' width='70' height='14' />
          {/* Battlements */}
          <rect x='310' y='34' width='12' height='20' />
          <rect x='330' y='34' width='12' height='20' />
          <rect x='350' y='34' width='12' height='20' />
          <rect x='370' y='34' width='12' height='20' />
          {/* Flag */}
          <rect x='340' y='4' width='4' height='34' />
          <polygon points='344,6 372,16 344,24' />

          {/* Center keep */}
          <rect x='460' y='140' width='280' height='140' />
          <rect x='450' y='130' width='300' height='14' />
          {/* Center battlements */}
          <rect x='450' y='114' width='14' height='20' />
          <rect x='478' y='114' width='14' height='20' />
          <rect x='506' y='114' width='14' height='20' />
          <rect x='534' y='114' width='14' height='20' />
          <rect x='562' y='114' width='14' height='20' />
          <rect x='590' y='114' width='14' height='20' />
          <rect x='618' y='114' width='14' height='20' />
          <rect x='646' y='114' width='14' height='20' />
          <rect x='674' y='114' width='14' height='20' />
          <rect x='702' y='114' width='14' height='20' />
          <rect x='730' y='114' width='14' height='20' />
          {/* Gate arch */}
          <path d='M565 280 L565 210 Q600 170 635 210 L635 280 Z' className='fill-bege-light' />
          {/* Windows */}
          <rect x='490' y='170' width='20' height='30' rx='10' className='fill-bege-light' />
          <rect x='690' y='170' width='20' height='30' rx='10' className='fill-bege-light' />

          {/* Right-center tower (tall) */}
          <rect x='830' y='70' width='50' height='210' />
          <rect x='820' y='60' width='70' height='14' />
          {/* Battlements */}
          <rect x='820' y='44' width='12' height='20' />
          <rect x='840' y='44' width='12' height='20' />
          <rect x='860' y='44' width='12' height='20' />
          <rect x='880' y='44' width='12' height='20' />

          {/* Right tower */}
          <rect x='1000' y='130' width='60' height='150' />
          <rect x='990' y='120' width='80' height='16' />
          {/* Battlements right tower */}
          <rect x='990' y='104' width='14' height='20' />
          <rect x='1012' y='104' width='14' height='20' />
          <rect x='1034' y='104' width='14' height='20' />
          <rect x='1056' y='104' width='14' height='20' />

          {/* Walls connecting towers */}
          <rect x='200' y='200' width='120' height='80' />
          <rect x='370' y='180' width='90' height='100' />
          <rect x='740' y='180' width='90' height='100' />
          <rect x='880' y='200' width='120' height='80' />

          {/* Wall battlements left */}
          <rect x='200' y='188' width='12' height='16' />
          <rect x='222' y='188' width='12' height='16' />
          <rect x='244' y='188' width='12' height='16' />
          <rect x='266' y='188' width='12' height='16' />
          <rect x='288' y='188' width='12' height='16' />
          <rect x='306' y='188' width='12' height='16' />

          {/* Wall battlements right */}
          <rect x='886' y='188' width='12' height='16' />
          <rect x='908' y='188' width='12' height='16' />
          <rect x='930' y='188' width='12' height='16' />
          <rect x='952' y='188' width='12' height='16' />
          <rect x='974' y='188' width='12' height='16' />
          <rect x='992' y='188' width='12' height='16' />
        </svg>
      </div>

      {/* Content */}
      <div className='relative z-10 max-w-lg'>
        <h1 className='text-green text-[8rem] leading-none font-extrabold tracking-tighter opacity-20 sm:text-[10rem]'>
          404
        </h1>

        <h2 className='text-h2_bold text-green -mt-4 sm:-mt-6'>{t('notFound.title')}</h2>

        <p className='text-body_regular text-disabled mt-4'>{t('notFound.description')}</p>

        {/* Action buttons */}
        <div className='mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4'>
          <Button asChild size='lg'>
            <Link href={transformUrl(lng, SITE_GET_URLS.projects)}>
              {t('notFound.viewProjects')}
            </Link>
          </Button>

          <Button asChild variant='outline' size='lg'>
            <Link href={transformUrl(lng, SITE_GET_URLS.events)}>
              {t('notFound.upcomingEvents')}
            </Link>
          </Button>

          <Button asChild variant='outline' size='lg'>
            <Link href={transformUrl(lng, '/crowdfunding')}>Crowdfunding</Link>
          </Button>
        </div>

        {/* Home link */}
        <div className='mt-6'>
          <Button asChild variant='link'>
            <Link href={transformUrl(lng, SITE_GET_URLS.home)}>
              &larr; {t('notFound.backHome')}
            </Link>
          </Button>
        </div>
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes soar {
          0%   { transform: translate(-50%, 0) rotate(-3deg); }
          25%  { transform: translate(-40%, -18px) rotate(1deg); }
          50%  { transform: translate(-50%, -28px) rotate(3deg); }
          75%  { transform: translate(-60%, -14px) rotate(-1deg); }
          100% { transform: translate(-50%, 0) rotate(-3deg); }
        }
      `}</style>
    </main>
  );
}
