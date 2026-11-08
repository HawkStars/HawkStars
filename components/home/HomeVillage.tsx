import Link from 'next/link';
import { HawkStarsSection } from '@/components/layout';
import SectionHeader from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/button';
import { ImageMedia } from '@/payload/components/Media';
import { SITE_GET_URLS, transformUrl } from '@/utils/paths';
import { villageFeatures, villageImages } from './config';
import { Reveal } from '@/components/ui/motion';
import type { HomeSectionProps } from './types';

export const HomeVillage = ({ t, lng }: HomeSectionProps) => (
  <HawkStarsSection spacing='loose' className='bg-bege-light overflow-hidden'>
    <div className='grid items-center gap-16 lg:grid-cols-2'>
      <Reveal from='left' className='relative order-2 lg:order-1'>
        <div className='relative aspect-4/3 overflow-hidden rounded-xl shadow-md'>
          <ImageMedia
            src={villageImages.exterior}
            alt={t('village.image_alt')}
            fill
            sizes='(min-width: 1024px) 50vw, 100vw'
            className='animate-ken-burns object-cover'
          />
        </div>
        <div className='animate-float absolute -right-4 -bottom-10 w-1/2 overflow-hidden rounded-xl shadow-lg ring-8 ring-white sm:-right-8'>
          <div className='relative aspect-4/3'>
            <ImageMedia
              src={villageImages.cowork}
              alt={t('village.image_alt_2')}
              fill
              sizes='25vw'
              className='object-cover'
            />
          </div>
        </div>
        <span className='bg-green absolute top-5 left-5 rounded-full px-4 py-2 text-xs font-bold tracking-wider text-white uppercase shadow-md'>
          {t('village.badge')}
        </span>
      </Reveal>

      <div className='order-1 lg:order-2'>
        <Reveal>
          <SectionHeader
            eyebrow={t('village.eyebrow')}
            title={t('village.title')}
            subtitle={t('village.description')}
          />
        </Reveal>
        <ul className='mt-8 flex flex-wrap gap-3'>
          {villageFeatures.map(({ key, icon: Icon }, i) => (
            <Reveal as='li' key={key} delay={150 + i * 80} from='scale'>
              <span className='bg-bege-dark text-green inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold'>
                <Icon aria-hidden='true' className='size-4' />
                {t(`village.features.${key}`)}
              </span>
            </Reveal>
          ))}
        </ul>
        <Reveal delay={500} className='mt-10 flex flex-wrap gap-4'>
          <Button asChild variant='accent' size='xl'>
            <Link href={transformUrl(lng, SITE_GET_URLS.crowdfunding)}>{t('village.cta')}</Link>
          </Button>
          <Button asChild variant='outline' size='xl'>
            <Link href={transformUrl(lng, SITE_GET_URLS.history)}>
              {t('village.cta_secondary')}
            </Link>
          </Button>
        </Reveal>
      </div>
    </div>
  </HawkStarsSection>
);
