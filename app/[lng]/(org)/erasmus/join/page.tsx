import { getMetadataPageInfo } from '@/utils/metadata';
import { Metadata } from 'next';
import Link from 'next/link';
import { LanguagePageProps } from '../../types';
import { Language } from '@/i18n/settings';
import { getServerTranslation } from '@/i18n';
import { HawkStarsSection } from '@/components/layout';
import NavbarVariant from '@/components/navbar/NavbarVariant';
import { SectionEyebrow } from '@/components/ui/SectionHeader';
import { SITE_GET_URLS, transformUrl } from '@/utils/paths';
import {
  coveredItems,
  faqItems,
  formatCards,
  joinSteps,
  TranslationFn,
  yourPartItems,
} from './config';

const CONTACT_EMAIL = 'geral@hawkstars.org';

export async function generateMetadata(props: LanguagePageProps): Promise<Metadata> {
  const { lng } = await props.params;
  return getMetadataPageInfo(lng as Language, 'erasmus_join');
}

const ErasmusJoinPage = async (props: LanguagePageProps) => {
  const { lng } = await props.params;
  const { t } = await getServerTranslation(lng as Language, 'erasmus-join');

  return (
    <HawkStarsSection padding='none' cap='none' className='flex-col'>
      <NavbarVariant variant='erasmus' />
      <Breadcrumb t={t} lng={lng} />
      <HeroSection t={t} lng={lng} />
      <Formats t={t} />
      <Journey t={t} />
      <WhatIsCovered t={t} />
      <FAQ t={t} />
      <CTABanner t={t} lng={lng} />
    </HawkStarsSection>
  );
};

export default ErasmusJoinPage;

type SectionProps = { t: TranslationFn };
type LinkedSectionProps = SectionProps & { lng: string };

// ── Breadcrumb ──

const Breadcrumb = ({ t, lng }: LinkedSectionProps) => (
  <nav className='bg-erasmus-blue flex items-center gap-2 px-4 pt-24 pb-3.5 text-xs text-white/55 sm:px-6 lg:px-8'>
    <div className='mx-auto flex w-full max-w-6xl items-center gap-2'>
      <Link
        href={transformUrl(lng, SITE_GET_URLS.erasmus)}
        className='hover:text-erasmus-gold text-white/55 transition-colors'
      >
        {t('breadcrumb_erasmus')}
      </Link>
      <span className='opacity-35'>›</span>
      <span className='text-erasmus-gold font-semibold'>{t('breadcrumb_current')}</span>
    </div>
  </nav>
);

// ── Hero ──

const HeroSection = ({ t, lng }: LinkedSectionProps) => (
  <header className='bg-erasmus-blue relative overflow-hidden px-4 pt-12 pb-24 sm:px-6 lg:px-8'>
    <div className='absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_40%,rgba(255,204,0,0.08)_0%,transparent_70%)]' />
    <div className='relative mx-auto w-full max-w-6xl'>
      <SectionEyebrow label={t('hero_eyebrow')} variant='gold' />
      <h1 className='mb-6 max-w-4xl font-serif text-[clamp(2.5rem,6vw,5rem)] leading-none font-black text-white'>
        {t('hero_title_pre')} <em className='text-erasmus-gold italic'>{t('hero_title_em')}</em>
      </h1>
      <p className='mb-10 max-w-140 text-lg leading-relaxed font-light text-white/70'>
        {t('hero_description')}
      </p>
      <div className='flex flex-wrap gap-4'>
        <a
          href='#steps'
          className='bg-erasmus-gold text-erasmus-blue inline-flex items-center gap-2 rounded-sm px-8 py-3.5 text-sm font-semibold tracking-wide transition-transform hover:-translate-y-0.5 hover:shadow-lg'
        >
          {t('hero_cta_steps')}
        </a>
        <Link
          href={transformUrl(lng, SITE_GET_URLS.projects)}
          className='inline-flex items-center gap-2 rounded-sm border border-white/35 px-8 py-3.5 text-sm font-semibold tracking-wide text-white transition-transform hover:-translate-y-0.5 hover:shadow-lg'
        >
          {t('hero_cta_projects')}
        </Link>
      </div>
    </div>
  </header>
);

// ── Formats ──

const Formats = ({ t }: SectionProps) => (
  <section className='px-4 py-24 sm:px-6 lg:px-8'>
    <div className='mx-auto max-w-6xl'>
      <SectionEyebrow label={t('formats_tag')} variant='blue' />
      <h2 className='text-erasmus-dark mb-5 font-serif text-[clamp(2rem,4vw,3.2rem)] leading-tight font-bold'>
        {t('formats_title')}
      </h2>
      <p className='text-erasmus-muted mb-14 max-w-140 text-base leading-relaxed'>
        {t('formats_lead')}
      </p>
      <div className='border-erasmus-blue/8 bg-erasmus-blue/8 grid grid-cols-1 gap-px border md:grid-cols-3'>
        {formatCards.map((card) => (
          <div key={card.titleKey} className='bg-white p-8'>
            <div className='mb-4 text-4xl'>{card.icon}</div>
            <span className='bg-erasmus-blue mb-3 inline-block rounded-sm px-3 py-1 text-xs font-bold tracking-[0.14em] text-white uppercase'>
              {t(card.ageKey)}
            </span>
            <h3 className='text-erasmus-dark mb-3 font-serif text-2xl font-bold'>
              {t(card.titleKey)}
            </h3>
            <p className='text-erasmus-muted text-sm leading-relaxed'>{t(card.descKey)}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ── Journey (step by step) ──

const Journey = ({ t }: SectionProps) => (
  <section id='steps' className='bg-bege-light px-4 py-24 sm:px-6 lg:px-8'>
    <div className='mx-auto max-w-4xl'>
      <SectionEyebrow label={t('steps_tag')} variant='blue' />
      <h2 className='text-erasmus-dark mb-5 font-serif text-[clamp(2rem,4vw,3.2rem)] leading-tight font-bold'>
        {t('steps_title')}
      </h2>
      <p className='text-erasmus-muted mb-14 max-w-140 text-base leading-relaxed'>
        {t('steps_lead')}
      </p>

      <ol className='relative'>
        {joinSteps.map((step, index) => (
          <li key={step.id} className='relative flex gap-6 pb-12 last:pb-0'>
            {index < joinSteps.length - 1 && (
              <span
                aria-hidden
                className='bg-erasmus-blue/15 absolute top-14 bottom-0 left-6 w-0.5'
              />
            )}
            <div className='bg-erasmus-blue text-erasmus-gold relative z-10 flex size-12 shrink-0 items-center justify-center rounded-full font-serif text-lg font-bold'>
              {index + 1}
            </div>
            <div className='flex-1 pt-1'>
              <h3 className='text-erasmus-dark mb-2 flex items-center gap-2 font-serif text-xl font-bold sm:text-2xl'>
                <span aria-hidden>{step.icon}</span>
                {t(step.titleKey)}
              </h3>
              <p className='text-erasmus-muted mb-4 text-base leading-relaxed'>{t(step.descKey)}</p>
              <p className='border-erasmus-gold text-erasmus-dark rounded-r-sm border-l-4 bg-white px-4 py-3 text-sm leading-relaxed'>
                <strong className='mr-1'>{t('tip_label')}</strong>
                {t(step.tipKey)}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  </section>
);

// ── What is covered ──

const WhatIsCovered = ({ t }: SectionProps) => (
  <section className='bg-erasmus-dark px-4 py-24 text-white sm:px-6 lg:px-8'>
    <div className='mx-auto max-w-6xl'>
      <SectionEyebrow label={t('covered_tag')} variant='gold' />
      <h2 className='mb-14 font-serif text-[clamp(2rem,4vw,3.2rem)] leading-tight font-bold text-white'>
        {t('covered_title')}
      </h2>
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        <ChecklistCard title={t('covered_list_title')} items={coveredItems} mark='✓' t={t} />
        <ChecklistCard title={t('yours_list_title')} items={yourPartItems} mark='→' t={t} />
      </div>
      <p className='mt-8 max-w-180 text-sm leading-relaxed text-white/50'>{t('covered_note')}</p>
    </div>
  </section>
);

const ChecklistCard = ({
  title,
  items,
  mark,
  t,
}: {
  title: string;
  items: readonly string[];
  mark: string;
  t: TranslationFn;
}) => (
  <div className='rounded-sm border border-white/10 bg-white/5 p-8'>
    <h3 className='text-erasmus-gold mb-6 font-serif text-xl font-bold'>{title}</h3>
    <ul className='flex flex-col gap-4'>
      {items.map((key) => (
        <li key={key} className='flex gap-3 text-sm leading-relaxed text-white/75'>
          <span aria-hidden className='text-erasmus-gold shrink-0 font-bold'>
            {mark}
          </span>
          {t(key)}
        </li>
      ))}
    </ul>
  </div>
);

// ── FAQ ──

const FAQ = ({ t }: SectionProps) => (
  <section className='px-4 py-24 sm:px-6 lg:px-8'>
    <div className='mx-auto max-w-4xl'>
      <SectionEyebrow label={t('faq_tag')} variant='blue' />
      <h2 className='text-erasmus-dark mb-10 font-serif text-[clamp(2rem,4vw,3.2rem)] leading-tight font-bold'>
        {t('faq_title')}
      </h2>
      <div className='border-erasmus-blue/10 divide-erasmus-blue/10 divide-y border-y'>
        {faqItems.map((item) => (
          <details key={item.qKey} className='group py-5'>
            <summary className='text-erasmus-dark flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold [&::-webkit-details-marker]:hidden'>
              {t(item.qKey)}
              <span
                aria-hidden
                className='text-erasmus-blue text-xl transition-transform group-open:rotate-45'
              >
                +
              </span>
            </summary>
            <p className='text-erasmus-muted mt-3 text-sm leading-relaxed'>{t(item.aKey)}</p>
          </details>
        ))}
      </div>
    </div>
  </section>
);

// ── CTA ──

const CTABanner = ({ t, lng }: LinkedSectionProps) => (
  <section className='bg-erasmus-gold px-4 py-20 text-center'>
    <h2 className='text-erasmus-blue mb-4 font-serif text-[clamp(2rem,5vw,3.5rem)] font-black'>
      {t('cta_title')}
    </h2>
    <p className='text-erasmus-blue/65 mx-auto mb-10 max-w-120 text-base leading-relaxed'>
      {t('cta_description')}
    </p>
    <div className='flex flex-wrap justify-center gap-4'>
      <Link
        href={transformUrl(lng, SITE_GET_URLS.projects)}
        className='bg-erasmus-blue text-erasmus-gold inline-flex items-center gap-2 rounded-sm px-8 py-3.5 text-sm font-semibold tracking-wide transition-transform hover:-translate-y-0.5 hover:shadow-lg'
      >
        {t('cta_projects')} →
      </Link>
      <a
        href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(t('email_subject'))}`}
        className='border-erasmus-blue text-erasmus-blue inline-flex items-center gap-2 rounded-sm border-2 px-8 py-3 text-sm font-semibold tracking-wide transition-transform hover:-translate-y-0.5'
      >
        {t('cta_contact')}
      </a>
    </div>
  </section>
);
