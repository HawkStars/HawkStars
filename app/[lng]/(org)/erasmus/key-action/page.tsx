import { getMetadataPageInfo } from '@/utils/metadata';
import { Metadata } from 'next';
import { LanguagePageProps } from '../../types';
import { Language } from '@/i18n/settings';
import { getServerTranslation } from '@/i18n';
import { HawkStarsSection } from '@/components/layout';
import Link from 'next/link';
import { urls, transformUrl } from '@/utils/paths';

export const revalidate = 600; // invalidate every 10 minutes

export async function generateMetadata(props: LanguagePageProps): Promise<Metadata> {
  const params = await props.params;
  const { lng } = params;
  const metadataPage = getMetadataPageInfo(lng as Language, 'erasmus_key_action');
  return metadataPage;
}

const KeyActionPage = async (props: LanguagePageProps) => {
  const params = await props.params;
  const { lng } = params;
  const { t } = await getServerTranslation(lng, 'erasmus-ka');

  return (
    <HawkStarsSection padding='none'>
      <Breadcrumb t={t} lng={lng} />
      <HeroSection t={t} />
      <main className='mx-auto max-w-275 px-4 xl:px-8'>
        {kaData.map((ka) => (
          <KASection key={ka.id} ka={ka} t={t} />
        ))}
        <ComparisonTable t={t} />
        <YouthpassBanner t={t} />
        <BackLink t={t} lng={lng} />
      </main>
    </HawkStarsSection>
  );
};

export default KeyActionPage;

// ── Types ──

type TranslationFn = (key: string) => string;

type KAData = {
  id: string;
  numberDisplay: string;
  numberSize?: string;
  pillKey: string;
  titleKey: string;
  taglineKey: string;
  color: string;
  lightColor: string;
  tabColor: string;
  detailKeys: { labelKey: string; valueKey: string }[];
  activityKeys: { icon: string; titleKey: string; descKey: string }[];
  whoIcon: string;
  whoTagKeys: string[];
};

// ── KA Data ──

const kaData: KAData[] = [
  {
    id: 'ka1',
    numberDisplay: 'KA1',
    pillKey: 'ka1_pill',
    titleKey: 'ka1_title',
    taglineKey: 'ka1_tagline',
    color: '#1a6b5a',
    lightColor: '#e6f4f1',
    tabColor: '#4dd9bc',
    detailKeys: [
      { labelKey: 'ka1_detail_duration_label', valueKey: 'ka1_detail_duration_value' },
      { labelKey: 'ka1_detail_who_label', valueKey: 'ka1_detail_who_value' },
      { labelKey: 'ka1_detail_funding_label', valueKey: 'ka1_detail_funding_value' },
      { labelKey: 'ka1_detail_countries_label', valueKey: 'ka1_detail_countries_value' },
    ],
    activityKeys: [
      { icon: '🎓', titleKey: 'ka1_act1_title', descKey: 'ka1_act1_desc' },
      { icon: '🛠️', titleKey: 'ka1_act2_title', descKey: 'ka1_act2_desc' },
      { icon: '📚', titleKey: 'ka1_act3_title', descKey: 'ka1_act3_desc' },
      { icon: '🏫', titleKey: 'ka1_act4_title', descKey: 'ka1_act4_desc' },
      { icon: '🌱', titleKey: 'ka1_act5_title', descKey: 'ka1_act5_desc' },
      { icon: '👩‍🏫', titleKey: 'ka1_act6_title', descKey: 'ka1_act6_desc' },
    ],
    whoIcon: '👤',
    whoTagKeys: [
      'ka1_who1',
      'ka1_who2',
      'ka1_who3',
      'ka1_who4',
      'ka1_who5',
      'ka1_who6',
      'ka1_who7',
      'ka1_who8',
    ],
  },
  {
    id: 'ka2',
    numberDisplay: 'KA2',
    pillKey: 'ka2_pill',
    titleKey: 'ka2_title',
    taglineKey: 'ka2_tagline',
    color: '#7b2d8b',
    lightColor: '#f3e8f7',
    tabColor: '#d18ddf',
    detailKeys: [
      { labelKey: 'ka2_detail_length_label', valueKey: 'ka2_detail_length_value' },
      { labelKey: 'ka2_detail_who_label', valueKey: 'ka2_detail_who_value' },
      { labelKey: 'ka2_detail_partners_label', valueKey: 'ka2_detail_partners_value' },
      { labelKey: 'ka2_detail_focus_label', valueKey: 'ka2_detail_focus_value' },
    ],
    activityKeys: [
      { icon: '🤝', titleKey: 'ka2_act1_title', descKey: 'ka2_act1_desc' },
      { icon: '🔬', titleKey: 'ka2_act2_title', descKey: 'ka2_act2_desc' },
      { icon: '🏗️', titleKey: 'ka2_act3_title', descKey: 'ka2_act3_desc' },
      { icon: '🌍', titleKey: 'ka2_act4_title', descKey: 'ka2_act4_desc' },
      { icon: '🏅', titleKey: 'ka2_act5_title', descKey: 'ka2_act5_desc' },
      { icon: '🌐', titleKey: 'ka2_act6_title', descKey: 'ka2_act6_desc' },
    ],
    whoIcon: '🏛️',
    whoTagKeys: [
      'ka2_who1',
      'ka2_who2',
      'ka2_who3',
      'ka2_who4',
      'ka2_who5',
      'ka2_who6',
      'ka2_who7',
      'ka2_who8',
    ],
  },
  {
    id: 'ka3',
    numberDisplay: 'KA3',
    pillKey: 'ka3_pill',
    titleKey: 'ka3_title',
    taglineKey: 'ka3_tagline',
    color: '#c0392b',
    lightColor: '#fdecea',
    tabColor: '#f08080',
    detailKeys: [
      { labelKey: 'ka3_detail_lead_label', valueKey: 'ka3_detail_lead_value' },
      { labelKey: 'ka3_detail_focus_label', valueKey: 'ka3_detail_focus_value' },
      { labelKey: 'ka3_detail_eligible_label', valueKey: 'ka3_detail_eligible_value' },
      { labelKey: 'ka3_detail_framework_label', valueKey: 'ka3_detail_framework_value' },
    ],
    activityKeys: [
      { icon: '🗣️', titleKey: 'ka3_act1_title', descKey: 'ka3_act1_desc' },
      { icon: '📋', titleKey: 'ka3_act2_title', descKey: 'ka3_act2_desc' },
      { icon: '🔎', titleKey: 'ka3_act3_title', descKey: 'ka3_act3_desc' },
      { icon: '🤝', titleKey: 'ka3_act4_title', descKey: 'ka3_act4_desc' },
    ],
    whoIcon: '🏛️',
    whoTagKeys: ['ka3_who1', 'ka3_who2', 'ka3_who3', 'ka3_who4', 'ka3_who5', 'ka3_who6'],
  },
  {
    id: 'jean',
    numberDisplay: 'JM',
    numberSize: 'text-6xl',
    pillKey: 'jm_pill',
    titleKey: 'jm_title',
    taglineKey: 'jm_tagline',
    color: '#1c4e80',
    lightColor: '#e8f0fb',
    tabColor: '#7eb8f7',
    detailKeys: [
      { labelKey: 'jm_detail_duration_label', valueKey: 'jm_detail_duration_value' },
      { labelKey: 'jm_detail_who_label', valueKey: 'jm_detail_who_value' },
      { labelKey: 'jm_detail_open_label', valueKey: 'jm_detail_open_value' },
      { labelKey: 'jm_detail_grant_label', valueKey: 'jm_detail_grant_value' },
    ],
    activityKeys: [
      { icon: '📖', titleKey: 'jm_act1_title', descKey: 'jm_act1_desc' },
      { icon: '🏛️', titleKey: 'jm_act2_title', descKey: 'jm_act2_desc' },
      { icon: '🔗', titleKey: 'jm_act3_title', descKey: 'jm_act3_desc' },
      { icon: '🏢', titleKey: 'jm_act4_title', descKey: 'jm_act4_desc' },
    ],
    whoIcon: '🎓',
    whoTagKeys: ['jm_who1', 'jm_who2', 'jm_who3', 'jm_who4', 'jm_who5', 'jm_who6'],
  },
  {
    id: 'sport',
    numberDisplay: 'SP',
    numberSize: 'text-7xl',
    pillKey: 'sport_pill',
    titleKey: 'sport_title',
    taglineKey: 'sport_tagline',
    color: '#d4660a',
    lightColor: '#fdf0e6',
    tabColor: '#f0b97a',
    detailKeys: [
      { labelKey: 'sport_detail_length_label', valueKey: 'sport_detail_length_value' },
      { labelKey: 'sport_detail_partners_label', valueKey: 'sport_detail_partners_value' },
      { labelKey: 'sport_detail_focus_label', valueKey: 'sport_detail_focus_value' },
      { labelKey: 'sport_detail_grant_label', valueKey: 'sport_detail_grant_value' },
    ],
    activityKeys: [
      { icon: '⚽', titleKey: 'sport_act1_title', descKey: 'sport_act1_desc' },
      { icon: '🏋️', titleKey: 'sport_act2_title', descKey: 'sport_act2_desc' },
      { icon: '🛡️', titleKey: 'sport_act3_title', descKey: 'sport_act3_desc' },
      { icon: '📊', titleKey: 'sport_act4_title', descKey: 'sport_act4_desc' },
    ],
    whoIcon: '🏟️',
    whoTagKeys: [
      'sport_who1',
      'sport_who2',
      'sport_who3',
      'sport_who4',
      'sport_who5',
      'sport_who6',
    ],
  },
];

// ── Breadcrumb ──

const Breadcrumb = ({ t, lng }: { t: TranslationFn; lng: string }) => (
  <nav className='flex items-center gap-2 bg-[#003399] px-4 py-3.5 text-[0.78rem] text-white/55 xl:px-40'>
    <Link
      href={transformUrl(lng, urls.erasmus)}
      className='text-white/55 transition-colors hover:text-[#FFCC00]'
    >
      {t('breadcrumb_erasmus')}
    </Link>
    <span className='opacity-35'>›</span>
    <span className='font-semibold text-[#FFCC00]'>{t('breadcrumb_current')}</span>
  </nav>
);

// ── Hero Section ──

const kaTabs = [
  { href: '#ka1', labelKey: 'tab_ka1', colorClass: 'hover:text-[#4dd9bc] hover:border-[#4dd9bc]' },
  { href: '#ka2', labelKey: 'tab_ka2', colorClass: 'hover:text-[#d18ddf] hover:border-[#d18ddf]' },
  { href: '#ka3', labelKey: 'tab_ka3', colorClass: 'hover:text-[#f08080] hover:border-[#f08080]' },
  {
    href: '#jean',
    labelKey: 'tab_jean',
    colorClass: 'hover:text-[#7eb8f7] hover:border-[#7eb8f7]',
  },
  {
    href: '#sport',
    labelKey: 'tab_sport',
    colorClass: 'hover:text-[#f0b97a] hover:border-[#f0b97a]',
  },
] as const;

const HeroSection = ({ t }: { t: TranslationFn }) => (
  <header className='relative overflow-hidden bg-[#0e0c1a] px-4 pt-20 pb-0 xl:px-40'>
    {/* Noise texture overlay */}
    <div className='pointer-events-none absolute inset-0 opacity-40' />
    {/* Glow */}
    <div className='pointer-events-none absolute -top-75 -right-50 h-200 w-200 rounded-full bg-[radial-gradient(circle,rgba(0,51,153,0.5)_0%,transparent_70%)]' />

    <div className='relative mx-auto max-w-275'>
      <div className='mb-8 inline-flex items-center gap-2.5 border border-[#FFCC004D] bg-[#FFCC001F] px-4 py-1.5 text-[0.7rem] font-bold tracking-[0.2em] text-[#FFCC00] uppercase'>
        {t('hero_label')}
      </div>

      <h1 className='mb-6 font-serif text-[clamp(2.8rem,6vw,5.5rem)] leading-[1.05] font-bold text-white'>
        {t('hero_title_pre')}{' '}
        <em className='bg-linear-to-r from-[#FFCC00] to-[#fff8cc] bg-clip-text text-transparent italic'>
          {t('hero_title_em')}
        </em>
        <br />
        {t('hero_title_post')}
      </h1>

      <p className='mb-16 max-w-150 text-base leading-relaxed font-light text-white/60'>
        {t('hero_sub')}
      </p>

      {/* KA navigation tabs */}
      <nav className='flex gap-0 overflow-x-auto'>
        {kaTabs.map((tab) => (
          <a
            key={tab.href}
            href={tab.href}
            className={`block border-b-[3px] border-transparent px-7 py-4 text-[0.82rem] font-semibold tracking-wide whitespace-nowrap text-white/45 transition-colors ${tab.colorClass}`}
          >
            {t(tab.labelKey)}
          </a>
        ))}
      </nav>
    </div>
  </header>
);

// ── KA Section ──

const KASection = ({ ka, t }: { ka: KAData; t: TranslationFn }) => (
  <section id={ka.id} className='border-b border-[#0e0c1a]/10 py-20 last:border-b-0'>
    {/* Header */}
    <div className='mb-12 grid grid-cols-1 items-start gap-8 md:grid-cols-[auto_1fr]'>
      <div
        className={`font-serif leading-none font-bold opacity-[0.12] select-none ${ka.numberSize ?? 'text-[6rem]'}`}
        style={{ color: ka.color }}
      >
        {ka.numberDisplay}
      </div>
      <div className='pt-2'>
        <span
          className='mb-4 inline-block rounded-sm px-4 py-1 text-[0.68rem] font-bold tracking-[0.18em] text-white uppercase'
          style={{ background: ka.color }}
        >
          {t(ka.pillKey)}
        </span>
        <h2 className='mb-3 font-serif text-[clamp(1.8rem,3.5vw,2.8rem)] leading-tight font-semibold text-[#0e0c1a]'>
          {t(ka.titleKey)}
        </h2>
        <p className='max-w-150 text-base leading-relaxed text-[#6a6780]'>{t(ka.taglineKey)}</p>
      </div>
    </div>

    {/* Detail chips */}
    <div className='mb-8 flex flex-wrap gap-3'>
      {ka.detailKeys.map((detail) => (
        <div
          key={detail.valueKey}
          className='flex items-center gap-2 rounded-sm border px-4 py-2 text-sm font-medium'
          style={{ background: ka.lightColor, borderColor: ka.color }}
        >
          <span className='font-normal text-[#6a6780]'>{t(detail.labelKey)}</span>
          {t(detail.valueKey)}
        </div>
      ))}
    </div>

    {/* Activities grid */}
    <div className='mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
      {ka.activityKeys.map((activity) => (
        <div
          key={activity.titleKey}
          className='border border-l-4 border-[#0e0c1a]/10 bg-white p-7 transition-all hover:-translate-y-0.5 hover:shadow-lg'
          style={{ borderLeftColor: ka.color }}
        >
          <h4 className='mb-2 flex items-center gap-2.5 text-base font-semibold'>
            <span>{activity.icon}</span>
            {t(activity.titleKey)}
          </h4>
          <p className='text-sm leading-relaxed text-[#6a6780]'>{t(activity.descKey)}</p>
        </div>
      ))}
    </div>

    {/* Who benefits */}
    <div
      className='grid grid-cols-[auto_1fr] items-start gap-6 border border-[#0e0c1a]/10 p-8'
      style={{ background: `linear-gradient(135deg, ${ka.lightColor} 0%, #ffffff 100%)` }}
    >
      <div className='text-4xl'>{ka.whoIcon}</div>
      <div>
        <h5
          className='mb-2.5 text-[0.7rem] font-bold tracking-[0.16em] uppercase'
          style={{ color: ka.color }}
        >
          {t('who_heading')}
        </h5>
        <div className='flex flex-wrap gap-2'>
          {ka.whoTagKeys.map((tagKey) => (
            <span
              key={tagKey}
              className='border border-[#0e0c1a]/10 bg-white px-3 py-1 text-sm text-[#0e0c1a]'
            >
              {t(tagKey)}
            </span>
          ))}
        </div>
      </div>
    </div>
  </section>
);

// ── Comparison Table ──

const comparisonRows = [
  {
    color: '#1a6b5a',
    nameKey: 'compare_ka1_name',
    focusKey: 'compare_ka1_focus',
    whoKey: 'compare_ka1_who',
    durationKey: 'compare_ka1_duration',
    fundingKey: 'compare_ka1_funding',
  },
  {
    color: '#7b2d8b',
    nameKey: 'compare_ka2_name',
    focusKey: 'compare_ka2_focus',
    whoKey: 'compare_ka2_who',
    durationKey: 'compare_ka2_duration',
    fundingKey: 'compare_ka2_funding',
  },
  {
    color: '#c0392b',
    nameKey: 'compare_ka3_name',
    focusKey: 'compare_ka3_focus',
    whoKey: 'compare_ka3_who',
    durationKey: 'compare_ka3_duration',
    fundingKey: 'compare_ka3_funding',
  },
  {
    color: '#1c4e80',
    nameKey: 'compare_jm_name',
    focusKey: 'compare_jm_focus',
    whoKey: 'compare_jm_who',
    durationKey: 'compare_jm_duration',
    fundingKey: 'compare_jm_funding',
  },
  {
    color: '#d4660a',
    nameKey: 'compare_sport_name',
    focusKey: 'compare_sport_focus',
    whoKey: 'compare_sport_who',
    durationKey: 'compare_sport_duration',
    fundingKey: 'compare_sport_funding',
  },
] as const;

const ComparisonTable = ({ t }: { t: TranslationFn }) => (
  <section className='-mx-4 bg-white px-4 py-20 xl:-mx-8 xl:px-8'>
    <SectionEyebrow label={t('compare_tag')} />
    <h2 className='mb-10 font-serif text-[clamp(1.8rem,3vw,2.6rem)] font-semibold'>
      {t('compare_title')}
    </h2>

    <div className='overflow-x-auto'>
      <table className='w-full border-collapse text-sm'>
        <thead>
          <tr>
            {['th_action', 'th_focus', 'th_who', 'th_duration', 'th_funding'].map((key) => (
              <th
                key={key}
                className='border-b-2 border-[#0e0c1a]/10 px-4 py-3.5 text-left text-[0.72rem] font-bold tracking-[0.12em] text-[#6a6780] uppercase'
              >
                {t(key)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {comparisonRows.map((row) => (
            <tr key={row.nameKey} className='transition-colors hover:bg-[#fafaf8]'>
              <td className='border-b border-[#0e0c1a]/10 px-4 py-4 align-top'>
                <div className='flex items-center gap-2 font-semibold'>
                  <span
                    className='h-2 w-2 shrink-0 rounded-full'
                    style={{ background: row.color }}
                  />
                  {t(row.nameKey)}
                </div>
              </td>
              <td className='border-b border-[#0e0c1a]/10 px-4 py-4 align-top leading-relaxed'>
                {t(row.focusKey)}
              </td>
              <td className='border-b border-[#0e0c1a]/10 px-4 py-4 align-top leading-relaxed'>
                {t(row.whoKey)}
              </td>
              <td className='border-b border-[#0e0c1a]/10 px-4 py-4 align-top leading-relaxed'>
                {t(row.durationKey)}
              </td>
              <td className='border-b border-[#0e0c1a]/10 px-4 py-4 align-top leading-relaxed'>
                {t(row.fundingKey)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
);

// ── Youthpass Banner ──

const YouthpassBanner = ({ t }: { t: TranslationFn }) => (
  <div className='-mx-4 grid grid-cols-1 items-center gap-8 bg-[#003399] px-8 py-16 text-white md:grid-cols-[1fr_auto] xl:-mx-8'>
    <div>
      <h3 className='mb-3 font-serif text-3xl font-semibold'>{t('youthpass_title')}</h3>
      <p className='max-w-125 text-sm leading-relaxed text-white/65'>{t('youthpass_desc')}</p>
    </div>
    <div className='rounded-sm bg-[#FFCC00] px-8 py-5 text-center text-sm font-bold whitespace-nowrap text-[#003399]'>
      <span className='mb-1 block text-3xl'>📄</span>
      {t('youthpass_badge_line1')}
      <br />
      {t('youthpass_badge_line2')}
    </div>
  </div>
);

// ── Back Link ──

const BackLink = ({ t, lng }: { t: TranslationFn; lng: string }) => (
  <div className='flex justify-center py-12'>
    <Link
      href={transformUrl(lng, urls.erasmus)}
      className='inline-flex items-center gap-2 border-2 border-[#003399] px-7 py-3 text-sm font-semibold text-[#003399] transition-colors hover:bg-[#003399] hover:text-white'
    >
      ← {t('back_link')}
    </Link>
  </div>
);

// ── Shared Components ──

const SectionEyebrow = ({ label }: { label: string }) => (
  <p className='mb-3 flex items-center gap-2.5 text-[0.7rem] font-bold tracking-[0.2em] text-[#003399] uppercase'>
    <span className='block h-0.5 w-7 bg-[#003399]' />
    {label}
  </p>
);
