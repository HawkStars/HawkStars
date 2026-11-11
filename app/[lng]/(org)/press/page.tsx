import { Metadata } from 'next';
import type { StaticImageData } from 'next/image';
import { LuArrowUpRight, LuDownload, LuMail } from 'react-icons/lu';

import { getServerTranslation } from '@/i18n';
import { Language } from '@/i18n/settings';
import { HawkStarsSection, PageHero } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { CopyButton } from '@/components/ui/CopyButton';
import SectionHeader from '@/components/ui/SectionHeader';
import { CONTACT_EMAIL } from '@/components/home/config';
import { CTABannerBlock } from '@/payload/blocks/CTABannerBlock/Component';
import { ImageMedia } from '@/payload/components/Media';
import { pressLinks } from '@/lib/press';
import { cn } from '@/lib/utils';
import { getMetadataPageInfo } from '@/utils/metadata';
import {
  coFoundedEuropeanLogoBlue,
  globalVillageLogo,
  hawkLogo,
  hawkLogoMark,
} from '@/utils/models/images/logos';
import { LanguagePageProps } from '../types';

export async function generateMetadata(props: LanguagePageProps): Promise<Metadata> {
  const { lng } = await props.params;
  return getMetadataPageInfo(lng as Language, 'press');
}

const PressPage = async (props: LanguagePageProps) => {
  const { lng } = await props.params;
  return <PressContent lng={lng as Language} />;
};

export default PressPage;

type T = (key: string) => string;

const FACT_KEYS = ['name', 'founded', 'hq', 'nif', 'motto', 'impact'] as const;

/** `dark`: a white logo, previewed on a dark tile so it stays visible. */
const LOGOS: { key: string; image: StaticImageData; file: string; dark?: boolean }[] = [
  { key: 'full', image: hawkLogo, file: '/images/logos/logo.svg' },
  { key: 'mark', image: hawkLogoMark, file: '/images/logos/logo-mark.svg' },
  {
    key: 'village',
    image: globalVillageLogo,
    file: '/images/logos/global_village.png',
    dark: true,
  },
  { key: 'eu', image: coFoundedEuropeanLogoBlue, file: '/images/logos/co-founded-blue.png' },
];

/** Hex values mirror the tokens in app/globals.css; the swatch itself uses the token. */
const COLORS = [
  { key: 'green', swatch: 'bg-green', hex: '#0A7558' },
  { key: 'bege', swatch: 'bg-bege-dark', hex: '#FAE7D0' },
  { key: 'light', swatch: 'bg-bege-light', hex: '#FEF9F6' },
  { key: 'gold', swatch: 'bg-gold', hex: '#F2A900' },
  { key: 'ink', swatch: 'bg-ink', hex: '#1F3A68' },
] as const;

const COVERAGE_GROUPS = ['hawkstars', 'ukraine', 'eurohawk'] as const;

async function PressContent({ lng }: { lng: Language }) {
  const { t } = await getServerTranslation(lng, 'press');
  const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(t('cta.email_subject'))}`;

  return (
    <>
      <PageHero
        eyebrow={t('hero.eyebrow')}
        title={t('hero.title')}
        description={t('hero.description')}
        actions={
          <Button asChild size='xl'>
            <a href={mailto}>
              <LuMail aria-hidden='true' className='size-5' />
              {t('hero.contact')}
            </a>
          </Button>
        }
      />

      <AboutSection t={t} />
      <FactsSection t={t} />
      <BrandSection t={t} />
      <CoverageSection t={t} />

      <CTABannerBlock
        blockType='ctaBanner'
        lng={lng}
        variant='split'
        title={t('cta.title')}
        description={t('cta.description')}
        links={[{ link: { type: 'custom', url: mailto, label: CONTACT_EMAIL, newTab: false } }]}
      />
    </>
  );
}

// ── Boilerplate ──

const AboutSection = ({ t }: { t: T }) => (
  <HawkStarsSection spacing='default'>
    <SectionHeader reveal eyebrow={t('about.eyebrow')} title={t('about.title')} />
    <div className='mt-10 grid grid-cols-1 gap-6 lg:grid-cols-[2fr_3fr]'>
      {(['short', 'long'] as const).map((key) => (
        <article key={key} className='card bg-bege-light flex flex-col gap-4 p-6 lg:p-8'>
          <div className='flex items-center justify-between gap-4'>
            <h3 className='text-eyebrow text-green'>{t(`about.${key}_label`)}</h3>
            <CopyButton
              text={t(`about.${key}`)}
              label={t('about.copy')}
              copiedLabel={t('about.copied')}
            />
          </div>
          <p className='leading-relaxed text-black/80'>{t(`about.${key}`)}</p>
        </article>
      ))}
    </div>
  </HawkStarsSection>
);

// ── Key facts ──

const FactsSection = ({ t }: { t: T }) => (
  <HawkStarsSection spacing='default' className='bg-bege-light'>
    <SectionHeader reveal eyebrow={t('facts.eyebrow')} title={t('facts.title')} />
    <dl className='mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
      {FACT_KEYS.map((key) => (
        <div key={key} className='card flex flex-col gap-1 bg-white p-5'>
          <dt className='text-eyebrow text-green'>{t(`facts.items.${key}.label`)}</dt>
          <dd className='text-body_semibold leading-snug'>{t(`facts.items.${key}.value`)}</dd>
        </div>
      ))}
    </dl>
  </HawkStarsSection>
);

// ── Logos and colours ──

const BrandSection = ({ t }: { t: T }) => (
  <HawkStarsSection spacing='default'>
    <SectionHeader
      reveal
      eyebrow={t('logos.eyebrow')}
      title={t('logos.title')}
      subtitle={t('logos.subtitle')}
    />
    <ul className='mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4'>
      {LOGOS.map((logo) => (
        <li
          key={logo.key}
          className='border-bege-dark flex flex-col overflow-hidden rounded-xl border'
        >
          <div
            className={cn(
              'flex h-40 items-center justify-center p-6',
              logo.dark ? 'bg-green' : 'bg-bege-light'
            )}
          >
            <ImageMedia
              src={logo.image}
              alt={t(`logos.items.${logo.key}`)}
              className='max-h-24 w-auto object-contain'
            />
          </div>
          <div className='flex items-center justify-between gap-3 p-4'>
            <span className='text-sm font-semibold'>{t(`logos.items.${logo.key}`)}</span>
            <a
              href={logo.file}
              download
              className='text-green hover:bg-green/10 flex items-center gap-1.5 rounded-md px-2 py-1 text-sm font-semibold'
            >
              <LuDownload aria-hidden='true' className='size-4' />
              <span className='sr-only'>{t('logos.download')}</span>
              {logo.file.split('.').pop()?.toUpperCase()}
            </a>
          </div>
        </li>
      ))}
    </ul>

    <h3 className='text-h2_bold mt-14 mb-6'>{t('colors.title')}</h3>
    <ul className='grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5'>
      {COLORS.map((color) => (
        <li key={color.key} className='border-bege-dark overflow-hidden rounded-xl border'>
          <div className={cn('h-24', color.swatch)} />
          <div className='p-3'>
            <p className='font-mono text-sm font-semibold'>{color.hex}</p>
            <p className='text-xs text-black/70'>{t(`colors.items.${color.key}`)}</p>
          </div>
        </li>
      ))}
    </ul>
  </HawkStarsSection>
);

// ── Press coverage ──

const CoverageSection = ({ t }: { t: T }) => (
  <HawkStarsSection spacing='default' className='bg-bege-light'>
    <SectionHeader reveal eyebrow={t('coverage.eyebrow')} title={t('coverage.title')} />
    <div className='mt-10 grid grid-cols-1 gap-8 lg:grid-cols-3'>
      {COVERAGE_GROUPS.map((group) => (
        <div key={group}>
          <h3 className='text-h3_semibold mb-4'>{t(`coverage.groups.${group}`)}</h3>
          <ul className='border-bege-dark divide-bege-dark divide-y rounded-xl border bg-white'>
            {pressLinks[group].map((link) => (
              <li key={link.url}>
                <a
                  href={link.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='hover:bg-bege-light group flex items-center justify-between gap-4 px-5 py-4 transition-colors'
                >
                  <span className='group-hover:text-green text-sm text-black/80'>{link.label}</span>
                  <LuArrowUpRight aria-hidden='true' className='text-green size-4 shrink-0' />
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </HawkStarsSection>
);
