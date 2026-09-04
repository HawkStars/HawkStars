import { getMetadataPageInfo } from '@/utils/metadata';
import { Metadata } from 'next';
import { LanguagePageProps } from '../types';
import { Language } from '@/i18n/settings';
import { getServerTranslation } from '@/i18n';
import { HawkStarsSection } from '@/components/layout';
import Link from 'next/link';
import StepsBlockComponent from '@/payload/blocks/StepsBlock/Component';
import { steps } from './config';
import { SectionEyebrow } from '@/components/ui/SectionHeader';

const CONTACT_EMAIL = 'geral@hawkstars.org';

export async function generateMetadata(props: LanguagePageProps): Promise<Metadata> {
  const params = await props.params;
  const { lng } = params;
  const metadataPage = getMetadataPageInfo(lng as Language, 'how_to_help_us');
  return metadataPage;
}

const HowToHelpUsPage = async (props: LanguagePageProps) => {
  const { lng } = await props.params;
  return <HowToHelpUsContent lng={lng} />;
};

// `getServerTranslation` resolves a dynamic `import()` of the locale JSON, which
// under `cacheComponents` counts as uncached data reached outside a boundary and
// makes the whole route blocking. Static content keyed only on `lng`, so cached.
async function HowToHelpUsContent({ lng }: { lng: string }) {
  const { t } = await getServerTranslation(lng as Language, 'how-to-help-us');

  return (
    <HawkStarsSection padding='none' className='flex-col'>
      <HeroSection t={t} />
      <WhyJoinSection t={t} />
      <PathsSection t={t} />
      <HowItWorksSection t={t} />
      <CTASection t={t} />
    </HawkStarsSection>
  );
}

export default HowToHelpUsPage;

// ── Types ──

type T = (key: string) => string;

// ── Hero ──

const HeroSection = ({ t }: { t: T }) => (
  <header className='bg-green relative overflow-hidden px-4 py-24 lg:py-32 xl:px-40'>
    {/* Decorative circles */}
    <div className='pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-white/5' />
    <div className='pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/5' />

    <div className='relative mx-auto max-w-4xl text-center'>
      <p className='mb-6 inline-flex items-center gap-2 rounded-sm border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-bold tracking-[0.2em] text-white uppercase'>
        <span className='block h-0.5 w-5 bg-white/60' />
        {t('hero_eyebrow')}
      </p>

      <h1 className='mb-6 text-4xl leading-tight font-bold text-white lg:text-6xl'>
        {t('hero_title_pre')} <span className='text-bege-dark'>{t('hero_title_highlight')}</span>
      </h1>

      <p className='mx-auto mb-10 max-w-xl text-lg leading-relaxed font-light text-white/75'>
        {t('hero_description')}
      </p>

      <div className='flex flex-wrap justify-center gap-4'>
        <a
          href='#paths'
          className='bg-bege-dark text-green inline-flex items-center gap-2 rounded-sm px-8 py-3.5 text-sm font-semibold tracking-wide transition-transform hover:-translate-y-0.5 hover:shadow-lg'
        >
          {t('hero_cta_explore')}
        </a>
        <a
          href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(t('email_subject'))}`}
          className='inline-flex items-center gap-2 rounded-sm border border-white/35 bg-transparent px-8 py-3.5 text-sm font-semibold tracking-wide text-white transition-transform hover:-translate-y-0.5 hover:shadow-lg'
        >
          {t('hero_cta_contact')}
        </a>
      </div>
    </div>
  </header>
);

// ── Why Join ──

const whyReasons = [
  { icon: '🌍', titleKey: 'why_impact_title', descKey: 'why_impact_desc' },
  { icon: '🤝', titleKey: 'why_community_title', descKey: 'why_community_desc' },
  { icon: '📚', titleKey: 'why_growth_title', descKey: 'why_growth_desc' },
  { icon: '🇪🇺', titleKey: 'why_europe_title', descKey: 'why_europe_desc' },
] as const;

const WhyJoinSection = ({ t }: { t: T }) => (
  <section className='px-4 py-20 lg:py-28 xl:px-40'>
    <div className='mx-auto max-w-5xl'>
      <SectionTag label={t('why_tag')} />
      <h2 className='text-h1_semibold mb-5 text-gray-900'>{t('why_title')}</h2>
      <p className='mb-14 max-w-xl text-base leading-relaxed text-gray-500'>{t('why_lead')}</p>

      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
        {whyReasons.map((reason) => (
          <div
            key={reason.titleKey}
            className='bg-bege-light group flex gap-5 rounded-lg p-8 transition-shadow hover:shadow-md'
          >
            <span className='shrink-0 text-3xl'>{reason.icon}</span>
            <div>
              <h3 className='text-body_semibold text-green mb-1'>{t(reason.titleKey)}</h3>
              <p className='text-sm leading-relaxed text-gray-600'>{t(reason.descKey)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ── Paths: Member vs Volunteer ──

const PathsSection = ({ t }: { t: T }) => (
  <section id='paths' className='bg-bege-light px-4 py-20 lg:py-28 xl:px-40'>
    <div className='mx-auto max-w-5xl'>
      <SectionTag label={t('paths_tag')} />
      <h2 className='text-h1_semibold mb-14 text-gray-900'>{t('paths_title')}</h2>

      <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
        {/* Member card */}
        <PathCard
          t={t}
          icon='🏛️'
          titleKey='member_title'
          descKey='member_desc'
          perks={['member_perk1', 'member_perk2', 'member_perk3', 'member_perk4']}
          ctaKey='member_cta'
          accentColor='green'
          emailSubjectKey='member_email_subject'
        />

        {/* Volunteer card */}
        <PathCard
          t={t}
          icon='🙌'
          titleKey='volunteer_title'
          descKey='volunteer_desc'
          perks={['volunteer_perk1', 'volunteer_perk2', 'volunteer_perk3', 'volunteer_perk4']}
          ctaKey='volunteer_cta'
          accentColor='green'
          emailSubjectKey='volunteer_email_subject'
        />
      </div>
    </div>
  </section>
);

const PathCard = ({
  t,
  icon,
  titleKey,
  descKey,
  perks,
  ctaKey,
  accentColor,
  emailSubjectKey,
}: {
  t: T;
  icon: string;
  titleKey: string;
  descKey: string;
  perks: string[];
  ctaKey: string;
  accentColor: string;
  emailSubjectKey: string;
}) => (
  <div className='group relative flex flex-col overflow-hidden rounded-lg bg-white shadow-sm transition-shadow hover:shadow-lg'>
    {/* Top accent bar */}
    <div className={`h-1.5 w-full bg-${accentColor}`} />

    <div className='flex flex-1 flex-col p-8 lg:p-10'>
      <span className='mb-4 text-4xl'>{icon}</span>
      <h3 className='text-h2_bold mb-3 text-gray-900'>{t(titleKey)}</h3>
      <p className='mb-8 text-sm leading-relaxed text-gray-600'>{t(descKey)}</p>

      {/* Perks list */}
      <div className='mb-8 flex flex-col gap-3'>
        {perks.map((perkKey) => (
          <div key={perkKey} className='flex items-start gap-3'>
            <span className='text-green mt-0.5 shrink-0 text-sm'>&#10003;</span>
            <span className='text-sm text-gray-700'>{t(perkKey)}</span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <Link
        href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(t(emailSubjectKey))}`}
        className='bg-green mt-auto inline-flex w-full items-center justify-center gap-2 rounded-sm px-6 py-3.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 hover:shadow-lg'
      >
        {t(ctaKey)}
      </Link>
    </div>
  </div>
);

// ── How It Works ──

const HowItWorksSection = ({ t }: { t: T }) => (
  <section className='px-4 py-20 lg:py-28 xl:px-40'>
    <div className='mx-auto max-w-5xl'>
      <SectionTag label={t('how_tag')} />
      <h2 className='text-h1_semibold mb-14 text-gray-900'>{t('how_title')}</h2>

      <StepsBlockComponent
        numberOfColumnsPerRow={'3'}
        dotColor={'green'}
        steps={steps.map((step) => ({
          ...step,
          title: t(step.title),
          description: t(step.description),
        }))}
        blockType={'stepsBlock'}
      />
    </div>
  </section>
);

// ── CTA Banner ──

const CTASection = ({ t }: { t: T }) => (
  <section className='bg-green relative overflow-hidden px-4 py-20 text-center xl:px-40'>
    <div className='pointer-events-none absolute -top-20 -left-20 h-72 w-72 rounded-full bg-white/5' />
    <div className='pointer-events-none absolute -right-16 -bottom-16 h-56 w-56 rounded-full bg-white/5' />

    <div className='relative mx-auto max-w-2xl'>
      <h2 className='mb-4 text-3xl font-bold text-white lg:text-4xl'>{t('cta_title')}</h2>
      <p className='mx-auto mb-10 max-w-md text-base leading-relaxed text-white/70'>
        {t('cta_description')}
      </p>
      <Link
        href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(t('email_subject'))}`}
        className='bg-bege-dark text-green inline-flex items-center gap-2 rounded-sm px-10 py-4 text-sm font-bold tracking-wide transition-transform hover:-translate-y-0.5 hover:shadow-lg'
      >
        {t('cta_button')}
      </Link>
      <p className='mt-6 text-sm text-white/50'>{CONTACT_EMAIL}</p>
    </div>
  </section>
);

// ── Shared ──

const SectionTag = ({ label }: { label: string }) => (
  <SectionEyebrow label={label} variant='green' />
);
