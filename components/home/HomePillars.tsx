import Link from 'next/link';
import { LuArrowUpRight } from 'react-icons/lu';
import { HawkStarsSection } from '@/components/layout';
import SectionHeader from '@/components/ui/SectionHeader';
import { ImageMedia } from '@/payload/components/Media';
import { SITE_GET_URLS, transformUrl } from '@/utils/paths';
import { pillars } from './config';
import { Reveal } from '@/components/ui/motion';
import type { HomeSectionProps } from './types';

export const HomePillars = ({ t, lng }: HomeSectionProps) => (
  <HawkStarsSection spacing='loose' className='bg-bege-light'>
    <Reveal>
      <SectionHeader
        eyebrow={t('pillars.eyebrow')}
        title={t('pillars.title')}
        align='center'
        className='mb-14'
      />
    </Reveal>

    <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
      {pillars.map(({ key, icon: Icon, image, path }, i) => (
        <Reveal key={key} delay={i * 120} className='h-full'>
          <Link
            href={transformUrl(lng, SITE_GET_URLS[path])}
            className='group card card-hover-lg relative flex h-full flex-col overflow-hidden bg-white transition-transform duration-500 hover:-translate-y-2'
          >
            <div className='relative aspect-4/3 overflow-hidden'>
              <ImageMedia
                src={image}
                alt={t(`pillars.${key}.image_alt`)}
                fill
                sizes='(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw'
                className='object-cover transition-transform duration-700 group-hover:scale-110'
              />
              <div className='from-green-dark/70 absolute inset-0 bg-linear-to-t to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100' />
            </div>
            <div className='flex flex-1 flex-col p-6'>
              <span className='bg-green relative -mt-12 mb-4 flex size-12 items-center justify-center rounded-full text-white shadow-md ring-4 ring-white transition-transform duration-500 group-hover:-rotate-12'>
                <Icon aria-hidden='true' className='size-5' />
              </span>
              <h3 className='text-h3_semibold text-green'>{t(`pillars.${key}.title`)}</h3>
              <p className='mt-2 flex-1 text-sm leading-relaxed text-black/70'>
                {t(`pillars.${key}.description`)}
              </p>
              <span className='text-green mt-5 inline-flex items-center gap-1 text-sm font-semibold'>
                {t('pillars.learn_more')}
                <LuArrowUpRight
                  aria-hidden='true'
                  className='transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5'
                />
              </span>
            </div>
          </Link>
        </Reveal>
      ))}
    </div>
  </HawkStarsSection>
);
