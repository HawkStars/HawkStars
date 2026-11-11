import Link from 'next/link';
import { Metadata } from 'next';
import { LuArrowUpRight, LuExternalLink } from 'react-icons/lu';

import { getServerTranslation } from '@/i18n';
import { Language } from '@/i18n/settings';
import { HawkStarsSection, PageHero } from '@/components/layout';
import { Button } from '@/components/ui/button';
import SectionHeader from '@/components/ui/SectionHeader';
import { Reveal } from '@/components/ui/motion';
import { ImageMedia } from '@/payload/components/Media';
import { TimelineBlock } from '@/payload/blocks/TimelineBlock/Component';
import { getMetadataPageInfo } from '@/utils/metadata';
import { CMS_PAGE_URLS, transformUrl } from '@/utils/paths';
import { euroHawkLogo, hawkLogo } from '@/utils/models/images/logos';
import { LanguagePageProps } from '../types';
import { historyReferenceUrl } from './config';
import { pressLinks } from '@/lib/press';

import historyHero from '@/public/images/history/hero.webp';
import humanitarianImage from '@/public/images/history/humanitarian_1.jpeg';
import globalVillageImage from '@/public/images/hero.png';

export async function generateMetadata(props: LanguagePageProps): Promise<Metadata> {
  const { lng } = await props.params;
  return getMetadataPageInfo(lng as Language, 'history');
}

const HawkHistoryPage = async (props: LanguagePageProps) => {
  const { lng } = await props.params;
  return <HistoryContent lng={lng as Language} />;
};

export default HawkHistoryPage;

type T = (key: string) => string;

const TIMELINE_KEYS = ['2015', '2016', '2017', '2018', '2022a', '2022b', 'today'] as const;

// Static content keyed only on `lng` (see how-to-help-us for the same pattern).
async function HistoryContent({ lng }: { lng: Language }) {
  const { t } = await getServerTranslation(lng, 'hawkstars');

  return (
    <>
      <HeroSection t={t} lng={lng} />
      <TimelineSection t={t} lng={lng} />
      <EuroHawkSection t={t} />
      <UkraineSection t={t} />
      <FoundationSection t={t} />
      <TodaySection t={t} lng={lng} />
      <PressSection t={t} />
    </>
  );
}

// ── Hero ──

const HeroSection = ({ t, lng }: { t: T; lng: Language }) => (
  <PageHero
    variant='green'
    eyebrow={t('hero.eyebrow')}
    title={
      <>
        {t('hero.title_pre')} <span className='text-bege-dark'>{t('hero.title_highlight')}</span>
      </>
    }
    description={t('hero.description')}
    actions={
      <>
        <Button asChild variant='inverse' size='xl'>
          <Link href={transformUrl(lng, CMS_PAGE_URLS.about)}>{t('hero.cta_about')}</Link>
        </Button>
        <Button asChild variant='outline-inverse' size='xl'>
          <Link href={transformUrl(lng, CMS_PAGE_URLS.village)}>{t('hero.cta_village')}</Link>
        </Button>
      </>
    }
  >
    {/* Version 1.0 → 2.0: the two logos joined by an arrow. */}
    <div className='relative mt-12 flex items-center gap-4 rounded-xl bg-white p-4 sm:gap-6 sm:p-6 lg:max-w-2xl'>
      <ImageMedia src={euroHawkLogo} alt={t('alt.euroHawkLogo')} className='h-12 w-auto sm:h-16' />
      <div aria-hidden='true' className='flex flex-1 items-center'>
        <span className='bg-green size-3 shrink-0 rounded-full' />
        <span className='bg-green h-0.5 flex-1' />
        <span className='border-l-green size-0 border-y-8 border-l-12 border-y-transparent' />
      </div>
      <ImageMedia src={hawkLogo} alt={t('alt.hawkStarsLogo')} className='h-12 w-auto sm:h-16' />
    </div>
  </PageHero>
);

// ── Timeline ──

const TimelineSection = ({ t, lng }: { t: T; lng: Language }) => (
  <TimelineBlock
    blockType='timeline'
    lng={lng}
    eyebrow={t('timeline.eyebrow')}
    title={t('timeline.title')}
    sectionId='percurso'
    orientation='vertical'
    highlightLast
    items={TIMELINE_KEYS.map((key) => ({
      id: key,
      year: t(`timeline.items.${key}.year`),
      title: t(`timeline.items.${key}.title`),
      description: t(`timeline.items.${key}.description`),
    }))}
  />
);

// ── EuroHawk (v1.0) ──

const festivalStats = [
  { value: '1400', key: 'visitors' },
  { value: '500', key: 'campers' },
  { value: '27', key: 'artists' },
] as const;

const EuroHawkSection = ({ t }: { t: T }) => (
  <HawkStarsSection spacing='default' className='bg-bege-light'>
    <div className='grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-16'>
      <div className='flex flex-col gap-5'>
        <SectionHeader reveal eyebrow={t('eurohawk.eyebrow')} title={t('eurohawk.title')} />
        <p className='text-body_regular leading-relaxed text-black/80'>{t('eurohawk.beginning')}</p>
        <p className='text-body_regular leading-relaxed text-black/80'>{t('eurohawk.activity')}</p>
        <p className='text-body_regular leading-relaxed text-black/80'>{t('eurohawk.festival')}</p>
      </div>

      <div className='flex flex-col gap-6'>
        <Reveal from='right' className='overflow-hidden rounded-xl shadow-md'>
          <ImageMedia
            src={historyHero}
            alt={t('alt.foundation')}
            sizes='(min-width: 1024px) 50vw, 100vw'
            className='h-auto w-full'
          />
        </Reveal>
        <dl className='grid grid-cols-3 gap-3'>
          {festivalStats.map((stat) => (
            <div key={stat.key} className='card flex flex-col gap-1 bg-white p-4 text-center'>
              <dt className='order-2 text-xs leading-snug text-black/70 sm:text-sm'>
                {t(`eurohawk.festival_stats.${stat.key}`)}
              </dt>
              <dd className='text-h2_bold text-green order-1'>{stat.value}</dd>
            </div>
          ))}
        </dl>
        <p className='text-body_regular border-green border-l-4 pl-4 leading-relaxed text-black/70'>
          {t('eurohawk.after')}
        </p>
      </div>
    </div>
  </HawkStarsSection>
);

// ── Together for Ukraine ──

const ukraineStats = [
  { value: '90', key: 'people' },
  { value: '18', key: 'institutions' },
  { value: '23', key: 'fireBrigades' },
  { value: '7', key: 'international' },
  { value: '5', key: 'trucks' },
  { value: '6', key: 'drivers' },
  { value: '30.342', key: 'distance' },
  { value: '24.500€', key: 'value' },
] as const;

const UkraineSection = ({ t }: { t: T }) => (
  <>
    <HawkStarsSection spacing='default' className='bg-green relative overflow-hidden text-white'>
      <div
        aria-hidden='true'
        className='pointer-events-none absolute -top-32 -right-32 size-96 rounded-full bg-white/5'
      />
      <div className='relative'>
        <SectionHeader
          reveal
          variant='inverse'
          eyebrow={t('ukraine.eyebrow')}
          title={t('ukraine.title')}
          subtitle={t('ukraine.description')}
          subtitleClassName='text-white/90'
        />

        <Reveal stagger as='dl' className='mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4'>
          {ukraineStats.map((stat) => (
            <div key={stat.key} className='flex flex-col gap-1 rounded-xl bg-white/10 p-5'>
              <dt className='order-2 text-sm leading-snug text-white/85'>
                {t(`ukraine.stats.${stat.key}`)}
              </dt>
              <dd className='text-h1_semibold text-bege-dark order-1'>{stat.value}</dd>
            </div>
          ))}
        </Reveal>

        <div className='mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2'>
          {(['tons', 'contributions'] as const).map((key) => (
            <div
              key={key}
              className='bg-bege-dark text-green flex flex-col gap-2 rounded-xl p-6 lg:p-8'
            >
              <p className='text-h2_semibold'>{t(`ukraine.highlights.${key}.title`)}</p>
              <p className='text-lg'>{t(`ukraine.highlights.${key}.description`)}</p>
            </div>
          ))}
        </div>

        <div className='mt-10'>
          <Button asChild variant='inverse' size='xl'>
            <a href={historyReferenceUrl.report} target='_blank' rel='noopener noreferrer'>
              {t('ukraine.report')}
              <LuExternalLink aria-hidden='true' className='size-4' />
            </a>
          </Button>
        </div>
      </div>
    </HawkStarsSection>

    <HawkStarsSection padding='none' cap='none'>
      <ImageMedia
        src={humanitarianImage}
        alt={t('alt.humanitarian')}
        sizes='100vw'
        className='max-h-[32rem] w-full object-cover'
      />
    </HawkStarsSection>
  </>
);

// ── Foundation ──

const FoundationSection = ({ t }: { t: T }) => (
  <HawkStarsSection spacing='default'>
    <div className='max-w-3xl'>
      <SectionHeader reveal eyebrow={t('foundation.eyebrow')} title={t('foundation.title')} />
      <p className='text-body mt-6 text-black/80'>{t('foundation.text')}</p>
      <p className='text-body_regular mt-6 leading-relaxed text-black/70'>
        {t('foundation.identity')}
      </p>
    </div>
  </HawkStarsSection>
);

// ── Today ──

const todayStats = [
  { value: '282', key: 'youth' },
  { value: '24', key: 'nationalities' },
  { value: '32', key: 'partners' },
] as const;

const TodaySection = ({ t, lng }: { t: T; lng: Language }) => (
  <HawkStarsSection spacing='default' className='bg-bege-light'>
    <div className='grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16'>
      <Reveal from='left'>
        <ImageMedia
          loading='lazy'
          src={globalVillageImage}
          alt={t('alt.village')}
          sizes='(min-width: 1024px) 50vw, 100vw'
          className='aspect-[1.2] w-full object-contain'
        />
      </Reveal>
      <div className='flex flex-col gap-6'>
        <SectionHeader reveal eyebrow={t('today.eyebrow')} title={t('today.title')} />
        <p className='text-body_regular leading-relaxed text-black/80'>{t('today.text')}</p>
        <dl className='grid grid-cols-3 gap-3'>
          {todayStats.map((stat) => (
            <div key={stat.key} className='card flex flex-col gap-1 bg-white p-4'>
              <dt className='order-2 text-xs leading-snug text-black/70 sm:text-sm'>
                {t(`today.stats.${stat.key}`)}
              </dt>
              <dd className='text-h2_bold text-green order-1'>{stat.value}</dd>
            </div>
          ))}
        </dl>
        <div className='flex flex-col gap-4 sm:flex-row'>
          <Button asChild size='xl'>
            <Link href={transformUrl(lng, CMS_PAGE_URLS.about)}>{t('hero.cta_about')}</Link>
          </Button>
          <Button asChild size='xl' variant='outline'>
            <Link href={transformUrl(lng, CMS_PAGE_URLS.village)}>{t('hero.cta_village')}</Link>
          </Button>
        </div>
      </div>
    </div>
  </HawkStarsSection>
);

// ── Press ──

const PressSection = ({ t }: { t: T }) => (
  <HawkStarsSection spacing='default'>
    <SectionHeader reveal eyebrow={t('press.eyebrow')} title={t('press.title')} />
    <div className='mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2'>
      {(['eurohawk', 'ukraine'] as const).map((group) => (
        <div key={group}>
          <h3 className='text-h3_semibold mb-4'>{t(`press.${group}`)}</h3>
          <ul className='border-bege-dark divide-bege-dark divide-y rounded-xl border'>
            {pressLinks[group].map((link) => (
              <li key={link.url}>
                <a
                  href={link.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='hover:bg-bege-light group flex items-center justify-between gap-4 px-5 py-4 transition-colors'
                >
                  <span className='group-hover:text-green text-sm text-black/80'>{link.label}</span>
                  <LuArrowUpRight
                    aria-hidden='true'
                    className='text-green size-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5'
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </HawkStarsSection>
);
