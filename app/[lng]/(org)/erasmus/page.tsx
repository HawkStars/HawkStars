import { getMetadataPageInfo } from '@/utils/metadata';
import { Metadata } from 'next';
import { LanguagePageProps } from '../types';
import { Language } from '@/i18n/settings';
import { getServerTranslation } from '@/i18n';
import { HawkStarsSection } from '@/components/layout';
import Link from 'next/link';

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
    <HawkStarsSection padding='none'>
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
    className='absolute -right-20 top-1/2 h-[600px] w-[600px] -translate-y-1/2 opacity-[0.07]'
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
  <header className='relative flex min-h-screen flex-col justify-center overflow-hidden bg-[#003399] px-4 py-24 xl:px-40'>
    {/* Background pattern overlay */}
    <div className='absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_40%,rgba(255,204,0,0.08)_0%,transparent_70%)]' />
    <EUStarsSVG />

    <div className='relative mx-auto w-full max-w-[1100px]'>
      <p className='mb-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#FFCC00]'>
        <span className='block h-0.5 w-10 bg-[#FFCC00]' />
        {t('hero_eyebrow')}
      </p>

      <h1 className='mb-6 font-serif text-[clamp(3rem,7vw,6rem)] font-black leading-none text-white'>
        {t('hero_title_line1')}
        <br />
        {t('hero_title_line2_pre')} <em className='italic text-[#FFCC00]'>{t('hero_title_line2_em')}</em>
      </h1>

      <p className='mb-12 max-w-[520px] text-lg font-light leading-relaxed text-white/70'>
        {t('hero_description')}
      </p>

      <div className='flex flex-wrap gap-4'>
        <a
          href='#programmes'
          className='inline-flex items-center gap-2 rounded-sm bg-[#FFCC00] px-8 py-3.5 text-sm font-semibold tracking-wide text-[#003399] transition-transform hover:-translate-y-0.5 hover:shadow-lg'
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
    <div className='font-serif text-3xl font-bold text-[#FFCC00]'>{value}</div>
    <div className='text-[0.72rem] uppercase tracking-[0.12em] text-white/50'>{label}</div>
  </div>
);

// ── Flagship Programmes ──

const flagshipCards = [
  {
    icon: '🎓',
    badgeKey: 'flagship_badge_education',
    titleKey: 'flagship_erasmus_title',
    descKey: 'flagship_erasmus_desc',
    linkKey: 'flagship_erasmus_link',
    href: 'https://erasmus-plus.ec.europa.eu',
    accentColor: '#003399',
  },
  {
    icon: '🤝',
    badgeKey: 'flagship_badge_volunteering',
    titleKey: 'flagship_esc_title',
    descKey: 'flagship_esc_desc',
    linkKey: 'flagship_esc_link',
    href: 'https://youth.europa.eu/solidarity-corps_en',
    accentColor: '#2ec4b6',
  },
  {
    icon: '💼',
    badgeKey: 'flagship_badge_work',
    titleKey: 'flagship_eures_title',
    descKey: 'flagship_eures_desc',
    linkKey: 'flagship_eures_link',
    href: 'https://eures.europa.eu',
    accentColor: '#ff9f1c',
  },
  {
    icon: '🌐',
    badgeKey: 'flagship_badge_digital',
    titleKey: 'flagship_digital_title',
    descKey: 'flagship_digital_desc',
    linkKey: 'flagship_digital_link',
    href: 'https://digital-skills-jobs.europa.eu',
    accentColor: '#e63946',
  },
] as const;

const FlagshipProgrammes = ({ t }: SectionProps) => (
  <section id='programmes' className='px-4 py-24 xl:px-40'>
    <div className='mx-auto max-w-[1100px]'>
      <SectionTag label={t('flagship_tag')} />
      <h2 className='mb-5 font-serif text-[clamp(2rem,4vw,3.2rem)] font-bold leading-tight text-[#0d0d1a]'>
        {t('flagship_title')}
      </h2>
      <p className='mb-14 max-w-[560px] text-base leading-relaxed text-[#6b6880]'>
        {t('flagship_lead')}
      </p>

      <div className='grid grid-cols-1 gap-px border border-[#00339914] bg-[#00339914] sm:grid-cols-2'>
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
  <div className='group relative overflow-hidden bg-white p-10 transition-colors hover:bg-[#fafbff]'>
    {/* Bottom accent bar on hover */}
    <div
      className='absolute bottom-0 left-0 h-[3px] w-full origin-left scale-x-0 transition-transform duration-300 ease-[cubic-bezier(.4,0,.2,1)] group-hover:scale-x-100'
      style={{ background: card.accentColor }}
    />
    <div className='mb-5 text-4xl'>{card.icon}</div>
    <span
      className='mb-3 inline-block rounded-sm px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-white'
      style={{ background: card.accentColor }}
    >
      {t(card.badgeKey)}
    </span>
    <h3 className='mb-3 font-serif text-2xl font-bold text-[#0d0d1a]'>{t(card.titleKey)}</h3>
    <p className='mb-6 text-sm leading-relaxed text-[#6b6880]'>{t(card.descKey)}</p>
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

const opportunityCards = [
  { icon: '🚂', titleKey: 'opp_discovereu_title', descKey: 'opp_discovereu_desc' },
  { icon: '🏛️', titleKey: 'opp_europass_title', descKey: 'opp_europass_desc' },
  { icon: '🧪', titleKey: 'opp_marie_title', descKey: 'opp_marie_desc' },
  { icon: '🌱', titleKey: 'opp_eit_title', descKey: 'opp_eit_desc' },
  { icon: '🗳️', titleKey: 'opp_portal_title', descKey: 'opp_portal_desc' },
  { icon: '💡', titleKey: 'opp_youth_action_title', descKey: 'opp_youth_action_desc' },
] as const;

const MoreOpportunities = ({ t }: SectionProps) => (
  <section className='bg-[#003399] px-4 py-24 text-white xl:px-40'>
    <div className='mx-auto max-w-[1100px]'>
      <SectionTag label={t('opps_tag')} variant='gold' />
      <h2 className='mb-5 font-serif text-[clamp(2rem,4vw,3.2rem)] font-bold leading-tight text-white'>
        {t('opps_title')}
      </h2>
      <p className='mb-14 max-w-[560px] text-base leading-relaxed text-white/65'>
        {t('opps_lead')}
      </p>

      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        {opportunityCards.map((card) => (
          <div
            key={card.titleKey}
            className='rounded-sm border border-white/10 bg-white/5 p-7 transition-colors hover:border-[#FFCC0066] hover:bg-white/10'
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

// ── How to Apply ──

const applySteps = [
  { titleKey: 'step_eligibility_title', descKey: 'step_eligibility_desc' },
  { titleKey: 'step_find_title', descKey: 'step_find_desc' },
  { titleKey: 'step_prepare_title', descKey: 'step_prepare_desc' },
  { titleKey: 'step_submit_title', descKey: 'step_submit_desc' },
  { titleKey: 'step_go_title', descKey: 'step_go_desc' },
] as const;

const HowToApply = ({ t }: SectionProps) => (
  <section id='apply' className='px-4 py-24 xl:px-40'>
    <div className='mx-auto max-w-[1100px]'>
      <SectionTag label={t('apply_tag')} />
      <h2 className='mb-5 font-serif text-[clamp(2rem,4vw,3.2rem)] font-bold leading-tight text-[#0d0d1a]'>
        {t('apply_title')}
      </h2>
      <p className='mb-14 max-w-[560px] text-base leading-relaxed text-[#6b6880]'>
        {t('apply_lead')}
      </p>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5'>
        {applySteps.map((step, i) => (
          <div
            key={step.titleKey}
            className={`relative px-4 py-10 ${i > 0 ? 'border-t border-[#00339914] lg:border-t-0 lg:border-l' : ''}`}
          >
            {/* Step number watermark */}
            <span className='absolute top-6 right-6 font-serif text-7xl font-black text-[#003399]/[0.07] leading-none'>
              {String(i + 1).padStart(2, '0')}
            </span>
            <div className='mb-5 h-2.5 w-2.5 rounded-full bg-[#003399]' />
            <h4 className='mb-2 font-serif text-lg font-bold'>{t(step.titleKey)}</h4>
            <p className='text-sm leading-relaxed text-[#6b6880]'>{t(step.descKey)}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ── Eligibility ──

const eligibilityItems = [
  { icon: '🎒', titleKey: 'elig_students_title', descKey: 'elig_students_desc' },
  { icon: '🛠️', titleKey: 'elig_vet_title', descKey: 'elig_vet_desc' },
  { icon: '🙋', titleKey: 'elig_neet_title', descKey: 'elig_neet_desc' },
  { icon: '👩‍🏫', titleKey: 'elig_workers_title', descKey: 'elig_workers_desc' },
  { icon: '🌍', titleKey: 'elig_partners_title', descKey: 'elig_partners_desc' },
] as const;

const Eligibility = ({ t }: SectionProps) => (
  <section className='bg-[#0d0d1a] px-4 py-24 text-white xl:px-40'>
    <div className='mx-auto max-w-[1100px]'>
      <SectionTag label={t('elig_tag')} variant='gold' />
      <h2 className='mb-10 font-serif text-[clamp(2rem,4vw,3.2rem)] font-bold leading-tight text-white'>
        {t('elig_title')}
      </h2>

      <div className='flex flex-col gap-px border border-white/10 bg-white/10'>
        {eligibilityItems.map((item) => (
          <div
            key={item.titleKey}
            className='flex items-start gap-6 bg-[#0d0d1a] px-6 py-6 transition-colors hover:bg-[#16162a]'
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
  <section className='bg-[#FFCC00] px-4 py-20 text-center'>
    <h2 className='mb-4 font-serif text-[clamp(2rem,5vw,3.5rem)] font-black text-[#003399]'>
      {t('cta_title')}
    </h2>
    <p className='mx-auto mb-10 max-w-[480px] text-base leading-relaxed text-[#001450]/65'>
      {t('cta_description')}
    </p>
    <Link
      href='https://youth.europa.eu'
      target='_blank'
      className='inline-flex items-center gap-2 rounded-sm bg-[#003399] px-8 py-3.5 text-sm font-semibold tracking-wide text-[#FFCC00] transition-transform hover:-translate-y-0.5 hover:shadow-lg'
    >
      {t('cta_button')} →
    </Link>
  </section>
);

// ── Shared Components ──

const SectionTag = ({ label, variant = 'blue' }: { label: string; variant?: 'blue' | 'gold' }) => (
  <p
    className={`mb-3 flex items-center gap-2.5 text-[0.7rem] font-bold uppercase tracking-[0.22em] ${
      variant === 'gold' ? 'text-[#FFCC00]' : 'text-[#003399]'
    }`}
  >
    <span className={`block h-0.5 w-7 ${variant === 'gold' ? 'bg-[#FFCC00]' : 'bg-[#003399]'}`} />
    {label}
  </p>
);
