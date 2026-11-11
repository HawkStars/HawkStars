import Link from 'next/link';
import { Metadata } from 'next';
import { LuArrowDown, LuTarget } from 'react-icons/lu';

import { getServerTranslation } from '@/i18n';
import { Language } from '@/i18n/settings';
import { HawkStarsSection, PageHero } from '@/components/layout';
import { Button } from '@/components/ui/button';
import SectionHeader from '@/components/ui/SectionHeader';
import { Reveal } from '@/components/ui/motion';
import { ImageMedia } from '@/payload/components/Media';
import { StatsBlock } from '@/payload/blocks/StatsBlock/Component';
import { Sede3DCtaBlock } from '@/payload/blocks/Sede3DCtaBlock/Component';
import { getMetadataPageInfo } from '@/utils/metadata';
import { CMS_PAGE_URLS, transformUrl } from '@/utils/paths';
import { LanguagePageProps } from '../types';

import pinhelAerial from '@/public/images/pinhel/foto1.jpeg';
import pinhelStreet from '@/public/images/pinhel/foto3.jpeg';

export async function generateMetadata(props: LanguagePageProps): Promise<Metadata> {
  const { lng } = await props.params;
  return getMetadataPageInfo(lng as Language, 'pinhel');
}

const PinhelPage = async (props: LanguagePageProps) => {
  const { lng } = await props.params;
  return <PinhelContent lng={lng as Language} />;
};

export default PinhelPage;

type T = (key: string) => string;

const REGION_STATS = [
  { key: 'population', value: '209.896', icon: 'LuUsers' },
  { key: 'density', value: '33,6', icon: 'LuMap' },
  { key: 'ageing', value: '330,9%', icon: 'LuHourglass' },
  { key: 'youthUnemployment', value: '23,4%', icon: 'LuBriefcase' },
] as const;

/** Each theme and how many facts it lists in the locale file (`facts.0`, `facts.1`…). */
const THEMES = [
  { key: 'demography', facts: 3 },
  { key: 'education', facts: 2 },
  { key: 'economy', facts: 3 },
  { key: 'culture', facts: 2 },
] as const;

const PINHEL_STATS = [
  { key: 'population', value: '7.849' },
  { key: 'density', value: '16,3' },
  { key: 'elderly', value: '39,4%' },
  { key: 'companies', value: '1.707' },
  { key: 'wage', value: '921 €' },
  { key: 'beds', value: '138' },
] as const;

async function PinhelContent({ lng }: { lng: Language }) {
  const { t } = await getServerTranslation(lng, 'pinhel');

  return (
    <>
      <PageHero
        variant='green'
        eyebrow={t('hero.eyebrow')}
        title={
          <>
            {t('hero.title_pre')}{' '}
            <span className='text-bege-dark'>{t('hero.title_highlight')}</span>
          </>
        }
        description={t('hero.description')}
        actions={
          <>
            <Button asChild variant='inverse' size='xl'>
              <a href='#desafios'>
                {t('themes.eyebrow')}
                <LuArrowDown aria-hidden='true' className='size-4' />
              </a>
            </Button>
            <Button asChild variant='outline-inverse' size='xl'>
              <Link href={transformUrl(lng, CMS_PAGE_URLS.village)}>{t('hero.cta_village')}</Link>
            </Button>
          </>
        }
      >
        <div className='relative mt-12 aspect-16/7 overflow-hidden rounded-xl shadow-lg'>
          <ImageMedia
            src={pinhelAerial}
            alt=''
            fill
            priority
            sizes='(min-width: 1280px) 1200px, 100vw'
            className='object-cover'
          />
        </div>
      </PageHero>

      <HawkStarsSection spacing='tight' padding='none' cap='none' container className='pt-16'>
        <SectionHeader
          reveal
          eyebrow={t('region.eyebrow')}
          title={t('region.title')}
          subtitle={t('region.subtitle')}
        />
      </HawkStarsSection>
      <StatsBlock
        blockType='statsBlock'
        lng={lng}
        columns='4'
        background='white'
        hoverBorderColor='green'
        stats={REGION_STATS.map((s) => ({
          id: s.key,
          icon: s.icon,
          iconAlign: 'left',
          title: s.value,
          titleAlign: 'left',
          description: t(`region.stats.${s.key}`),
          descriptionAlign: 'left',
        }))}
      />

      <ThemesSection t={t} />
      <PinhelSection t={t} />

      <Sede3DCtaBlock
        blockType='sede3dCta'
        lng={lng}
        title={t('sede.title')}
        description={t('sede.description')}
      />

      <HawkStarsSection spacing='tight'>
        <p className='text-xs leading-relaxed text-black/60'>{t('sources')}</p>
      </HawkStarsSection>
    </>
  );
}

// ── Challenge → response, per theme ──

const ThemesSection = ({ t }: { t: T }) => (
  <HawkStarsSection id='desafios' spacing='default' className='bg-bege-light'>
    <SectionHeader reveal eyebrow={t('themes.eyebrow')} title={t('themes.title')} />
    <ol className='mt-12 flex flex-col gap-6'>
      {THEMES.map(({ key, facts }, index) => (
        <Reveal
          as='li'
          key={key}
          className='border-bege-dark grid grid-cols-1 overflow-hidden rounded-xl border bg-white shadow-sm lg:grid-cols-[1fr_1fr]'
        >
          <div className='flex flex-col gap-4 p-6 lg:p-8'>
            <div className='flex items-baseline gap-3'>
              <span className='font-display text-green/30 text-4xl font-semibold'>
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className='text-h2_bold'>{t(`themes.items.${key}.title`)}</h3>
            </div>
            <ul className='flex flex-wrap gap-2'>
              {Array.from({ length: facts }, (_, i) => (
                <li
                  key={i}
                  className='bg-bege-light rounded-full px-3 py-1 text-sm font-medium text-black/80'
                >
                  {t(`themes.items.${key}.facts.${i}`)}
                </li>
              ))}
            </ul>
            <div>
              <p className='text-eyebrow mb-1 text-black/50'>{t('themes.challenge')}</p>
              <p className='leading-relaxed text-black/80'>{t(`themes.items.${key}.challenge`)}</p>
            </div>
          </div>
          <div className='bg-green flex flex-col justify-center gap-3 p-6 text-white lg:p-8'>
            <p className='text-eyebrow text-bege-dark flex items-center gap-2'>
              <LuTarget aria-hidden='true' className='size-4' />
              {t('themes.response')}
            </p>
            <p className='text-lg leading-relaxed'>{t(`themes.items.${key}.response`)}</p>
          </div>
        </Reveal>
      ))}
    </ol>
  </HawkStarsSection>
);

// ── Pinhel close-up ──

const PinhelSection = ({ t }: { t: T }) => (
  <HawkStarsSection spacing='default'>
    <div className='grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-16'>
      <div className='flex flex-col gap-6'>
        <SectionHeader reveal eyebrow={t('pinhel.eyebrow')} title={t('pinhel.title')} />
        <p className='text-body_regular leading-relaxed text-black/80'>{t('pinhel.text')}</p>
        <dl className='grid grid-cols-2 gap-3 sm:grid-cols-3'>
          {PINHEL_STATS.map((stat) => (
            <div key={stat.key} className='card bg-bege-light flex flex-col gap-1 p-4'>
              <dt className='order-2 text-xs leading-snug text-black/70 sm:text-sm'>
                {t(`pinhel.stats.${stat.key}`)}
              </dt>
              <dd className='text-h2_bold text-green order-1'>{stat.value}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className='flex flex-col gap-6'>
        <Reveal from='right' className='relative aspect-4/3 overflow-hidden rounded-xl shadow-md'>
          <ImageMedia
            src={pinhelStreet}
            alt=''
            fill
            sizes='(min-width: 1024px) 50vw, 100vw'
            className='object-cover'
          />
        </Reveal>
        <div className='border-green border-l-4 pl-5'>
          <h3 className='text-h3_semibold mb-2'>{t('pinhel.potential_title')}</h3>
          <p className='leading-relaxed text-black/80'>{t('pinhel.potential_text')}</p>
        </div>
      </div>
    </div>
  </HawkStarsSection>
);
