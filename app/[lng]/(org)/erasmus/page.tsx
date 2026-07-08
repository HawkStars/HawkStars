import { getMetadataPageInfo } from '@/utils/metadata';
import { Metadata } from 'next';
import { LanguagePageProps } from '../types';
import { Language } from '@/i18n/settings';
import { getServerTranslation } from '@/i18n';
import { HawkStarsSection } from '@/components/layout';
import Link from 'next/link';
import { applySteps, eligibilityItems, flagshipCards, opportunityCards } from './config';
import StepsBlockComponent from '@/payload/blocks/StepsBlock/Component';
import NavbarVariant from '@/components/navbar/NavbarVariant';

export const revalidate = 600; // invalidate every 10 minutes

export async function generateMetadata(props: LanguagePageProps): Promise<Metadata> {
  const params = await props.params;
  const { lng } = params;
  const metadataPage = getMetadataPageInfo(lng as Language, 'erasmus');
  return metadataPage;
}

const ErasmusPage = async (props: LanguagePageProps) => {
  const params = await props.params;
  const { lng } = params;
  const { t } = await getServerTranslation(lng, 'erasmus');

  return (
    <HawkStarsSection padding='none' className='flex-col'>
      <NavbarVariant variant='erasmus' />
      <HeroSection t={t} />
      <FlagshipProgrammes t={t} />
      <MoreOpportunities t={t} />
      <HowToApply t={t} />
      <Eligibility t={t} />
      <CTABanner t={t} />
    </HawkStarsSection>
  );
};

export default ErasmusPage;

// ── Types ──

type SectionProps = {
  t: (key: string) => string;
};

// ── EU Stars SVG ──

const EUStarsSVG = () => (
  <svg
    className='absolute top-1/2 -right-20 h-150 w-150 -translate-y-1/2 opacity-[0.07]'
    viewBox='0 0 600 600'
    xmlns='http://www.w3.org/2000/svg'
    fill='white'
  >
    <g transform='translate(300,300)'>
      <g id='s'>
        <polygon
          points='0,-18 4,-6 16,-6 7,2 11,14 0,6 -11,14 -7,2 -16,-6 -4,-6'
          transform='translate(0,-230)'
        />
      </g>
      <use href='#s' transform='rotate(30)' />
      <use href='#s' transform='rotate(60)' />
      <use href='#s' transform='rotate(90)' />
      <use href='#s' transform='rotate(120)' />
      <use href='#s' transform='rotate(150)' />
      <use href='#s' transform='rotate(180)' />
      <use href='#s' transform='rotate(210)' />
      <use href='#s' transform='rotate(240)' />
      <use href='#s' transform='rotate(270)' />
      <use href='#s' transform='rotate(300)' />
      <use href='#s' transform='rotate(330)' />
    </g>
  </svg>
);

// ── Hero Section ──

const HeroSection = ({ t }: SectionProps) => (
  <header className='bg-erasmus-blue relative flex min-h-screen flex-col justify-center overflow-hidden px-4 py-24 xl:px-40'>
    {/* Background pattern overlay */}
    <div className='absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_40%,rgba(255,204,0,0.08)_0%,transparent_70%)]' />
    <EUStarsSVG />

    <div className='relative mx-auto w-full max-w-275'>
      <p className='text-erasmus-gold mb-6 flex items-center gap-3 text-xs font-semibold tracking-[0.25em] uppercase'>
        <span className='bg-erasmus-gold block h-0.5 w-10' />
        {t('hero_eyebrow')}
      </p>

      <h1 className='mb-6 font-serif text-[clamp(3rem,7vw,6rem)] leading-none font-black text-white'>
        {t('hero_title_line1')}
        <br />
        {t('hero_title_line2_pre')}{' '}
        <em className='text-erasmus-gold italic'>{t('hero_title_line2_em')}</em>
      </h1>

      <p className='mb-12 max-w-130 text-lg leading-relaxed font-light text-white/70'>
        {t('hero_description')}
      </p>

      <div className='flex flex-wrap gap-4'>
        <a
          href='#programmes'
          className='bg-erasmus-gold text-erasmus-blue inline-flex items-center gap-2 rounded-sm px-8 py-3.5 text-sm font-semibold tracking-wide transition-transform hover:-translate-y-0.5 hover:shadow-lg'
        >
          {t('hero_cta_explore')}
        </a>
        <a
          href='#apply'
          className='inline-flex items-center gap-2 rounded-sm border border-white/35 bg-transparent px-8 py-3.5 text-sm font-semibold tracking-wide text-white transition-transform hover:-translate-y-0.5 hover:shadow-lg'
        >
          {t('hero_cta_apply')}
        </a>
      </div>

      <div className='mt-12 flex flex-wrap gap-10 md:absolute md:right-0 md:bottom-12 md:mt-0'>
        <HeroStat value='€26.2B' label={t('stat_budget')} />
        <HeroStat value='10M+' label={t('stat_participants')} />
        <HeroStat value='150+' label={t('stat_countries')} />
      </div>
    </div>
  </header>
);

const HeroStat = ({ value, label }: { value: string; label: string }) => (
  <div className='text-left md:text-right'>
    <div className='text-erasmus-gold font-serif text-3xl font-bold'>{value}</div>
    <div className='text-[0.72rem] tracking-[0.12em] text-white/50 uppercase'>{label}</div>
  </div>
);

const FlagshipProgrammes = ({ t }: SectionProps) => (
  <section id='programmes' className='px-4 py-24 xl:px-40'>
    <div className='mx-auto max-w-275'>
      <SectionTag label={t('flagship_tag')} />
      <h2 className='text-erasmus-dark mb-5 font-serif text-[clamp(2rem,4vw,3.2rem)] leading-tight font-bold'>
        {t('flagship_title')}
      </h2>
      <p className='text-erasmus-muted mb-14 max-w-140 text-base leading-relaxed'>
        {t('flagship_lead')}
      </p>

      <div className='border-erasmus-blue/8 bg-erasmus-blue/8 grid grid-cols-1 gap-px border sm:grid-cols-2'>
        {flagshipCards.map((card) => (
          <FlagshipCard key={card.titleKey} card={card} t={t} />
        ))}
      </div>
    </div>
  </section>
);

const FlagshipCard = ({
  card,
  t,
}: {
  card: (typeof flagshipCards)[number];
  t: (key: string) => string;
}) => (
  <div className='group hover:bg-bege-light relative overflow-hidden bg-white p-10 transition-colors'>
    {/* Bottom accent bar on hover */}
    <div
      className='absolute bottom-0 left-0 h-0.75 w-full origin-left scale-x-0 transition-transform duration-300 ease-in-out group-hover:scale-x-100'
      style={{ background: card.accentColor }}
    />
    <div className='mb-5 text-4xl'>{card.icon}</div>
    <span
      className='mb-3 inline-block rounded-sm px-3 py-1 text-[0.65rem] font-bold tracking-[0.14em] text-white uppercase'
      style={{ background: card.accentColor }}
    >
      {t(card.badgeKey)}
    </span>
    <h3 className='text-erasmus-dark mb-3 font-serif text-2xl font-bold'>{t(card.titleKey)}</h3>
    <p className='text-erasmus-muted mb-6 text-sm leading-relaxed'>{t(card.descKey)}</p>
    <Link
      href={card.href}
      target='_blank'
      className='group/link inline-flex items-center gap-1.5 text-sm font-semibold tracking-wide'
      style={{ color: card.accentColor }}
    >
      {t(card.linkKey)}
      <span className='transition-transform group-hover/link:translate-x-1'>→</span>
    </Link>
  </div>
);

// ── More Opportunities ──

const MoreOpportunities = ({ t }: SectionProps) => (
  <section className='bg-erasmus-blue px-4 py-24 text-white xl:px-40'>
    <div className='mx-auto max-w-275'>
      <SectionTag label={t('opps_tag')} variant='gold' />
      <h2 className='mb-5 font-serif text-[clamp(2rem,4vw,3.2rem)] leading-tight font-bold text-white'>
        {t('opps_title')}
      </h2>
      <p className='mb-14 max-w-140 text-base leading-relaxed text-white/65'>{t('opps_lead')}</p>

      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        {opportunityCards.map((card) => (
          <div
            key={card.titleKey}
            className='hover:border-erasmus-gold/40 rounded-sm border border-white/10 bg-white/5 p-7 transition-colors hover:bg-white/10'
          >
            <div className='mb-4 text-3xl'>{card.icon}</div>
            <h4 className='mb-2 font-serif text-lg font-bold'>{t(card.titleKey)}</h4>
            <p className='text-sm leading-relaxed text-white/60'>{t(card.descKey)}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const HowToApply = ({ t }: SectionProps) => (
  <section id='apply' className='px-4 py-24 xl:px-40'>
    <div className='mx-auto max-w-275'>
      <SectionTag label={t('apply_tag')} />
      <h2 className='text-erasmus-dark mb-5 font-serif text-[clamp(2rem,4vw,3.2rem)] leading-tight font-bold'>
        {t('apply_title')}
      </h2>
      <p className='text-erasmus-muted mb-14 max-w-140 text-base leading-relaxed'>
        {t('apply_lead')}
      </p>

      <StepsBlockComponent
        numberOfColumnsPerRow='5'
        steps={applySteps.map((step) => ({
          title: t(step.title),
          description: t(step.description),
          id: step.id,
        }))}
        dotColor='blue'
        sectionId='apply-steps'
        blockType='stepsBlock'
      />
    </div>
  </section>
);

const Eligibility = ({ t }: SectionProps) => (
  <section className='bg-erasmus-dark px-4 py-24 text-white xl:px-40'>
    <div className='mx-auto max-w-275'>
      <SectionTag label={t('elig_tag')} variant='gold' />
      <h2 className='mb-10 font-serif text-[clamp(2rem,4vw,3.2rem)] leading-tight font-bold text-white'>
        {t('elig_title')}
      </h2>

      <div className='flex flex-col gap-px border border-white/10 bg-white/10'>
        {eligibilityItems.map((item) => (
          <div
            key={item.titleKey}
            className='bg-erasmus-dark hover:bg-erasmus-dark/90 flex items-start gap-6 px-6 py-6 transition-colors'
          >
            <div className='mt-0.5 shrink-0 text-2xl'>{item.icon}</div>
            <div>
              <h5 className='mb-1 text-base font-semibold'>{t(item.titleKey)}</h5>
              <p className='text-sm leading-relaxed text-white/50'>{t(item.descKey)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ── CTA Banner ──

const CTABanner = ({ t }: SectionProps) => (
  <section className='bg-erasmus-gold px-4 py-20 text-center'>
    <h2 className='text-erasmus-blue mb-4 font-serif text-[clamp(2rem,5vw,3.5rem)] font-black'>
      {t('cta_title')}
    </h2>
    <p className='text-erasmus-blue/65 mx-auto mb-10 max-w-120 text-base leading-relaxed'>
      {t('cta_description')}
    </p>
    <Link
      href='https://youth.europa.eu'
      target='_blank'
      className='bg-erasmus-blue text-erasmus-gold inline-flex items-center gap-2 rounded-sm px-8 py-3.5 text-sm font-semibold tracking-wide transition-transform hover:-translate-y-0.5 hover:shadow-lg'
    >
      {t('cta_button')} →
    </Link>
  </section>
);

// ── Shared Components ──

const SectionTag = ({ label, variant = 'blue' }: { label: string; variant?: 'blue' | 'gold' }) => (
  <p
    className={`mb-3 flex items-center gap-2.5 text-[0.7rem] font-bold tracking-[0.22em] uppercase ${
      variant === 'gold' ? 'text-erasmus-gold' : 'text-erasmus-blue'
    }`}
  >
    <span
      className={`block h-0.5 w-7 ${variant === 'gold' ? 'bg-erasmus-gold' : 'bg-erasmus-blue'}`}
    />
    {label}
  </p>
);
