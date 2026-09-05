import { getMetadataPageInfo } from '@/utils/metadata';
import { Metadata } from 'next';
import { LanguagePageProps } from '../../types';
import { Language } from '@/i18n/settings';
import { getServerTranslation } from '@/i18n';
import { HawkStarsSection } from '@/components/layout';
import Link from 'next/link';
import { SITE_GET_URLS, transformUrl } from '@/utils/paths';
import { comparisonRows, KAData, kaData, kaTabs, TranslationFn } from './config';

export async function generateMetadata(props: LanguagePageProps): Promise<Metadata> {
  const params = await props.params;
  const { lng } = params;
  const metadataPage = getMetadataPageInfo(lng as Language, 'erasmus_key_action');
  return metadataPage;
}

const KeyActionPage = async (props: LanguagePageProps) => {
  const { lng } = await props.params;
  return <KeyActionContent lng={lng} />;
};

async function KeyActionContent({ lng }: { lng: string }) {
  const { t } = await getServerTranslation(lng as Language, 'erasmus-ka');

  return (
    <HawkStarsSection padding='none' cap='none'>
      <Breadcrumb t={t} lng={lng} />
      <HeroSection t={t} />
      <div className='mx-auto max-w-275 px-4 xl:px-8'>
        {kaData.map((ka) => (
          <KASection key={ka.id} ka={ka} t={t} />
        ))}
        <ComparisonTable t={t} />
        <YouthpassBanner t={t} />
        <BackLink t={t} lng={lng} />
      </div>
    </HawkStarsSection>
  );
}

export default KeyActionPage;

// ── Breadcrumb ──

const Breadcrumb = ({ t, lng }: { t: TranslationFn; lng: string }) => (
  <nav className='bg-erasmus-blue flex items-center gap-2 px-4 py-3.5 text-[0.78rem] text-white/55 xl:px-40'>
    <Link
      href={transformUrl(lng, SITE_GET_URLS.erasmus)}
      className='hover:text-erasmus-gold text-white/55 transition-colors'
    >
      {t('breadcrumb_erasmus')}
    </Link>
    <span className='opacity-35'>›</span>
    <span className='text-erasmus-gold font-semibold'>{t('breadcrumb_current')}</span>
  </nav>
);

const HeroSection = ({ t }: { t: TranslationFn }) => (
  <header className='bg-erasmus-dark relative overflow-hidden px-4 pt-20 pb-0 xl:px-40'>
    {/* Noise texture overlay */}
    <div className='pointer-events-none absolute inset-0 opacity-40' />
    {/* Glow */}
    <div className='pointer-events-none absolute -top-75 -right-50 h-200 w-200 rounded-full bg-[radial-gradient(circle,rgba(0,51,153,0.5)_0%,transparent_70%)]' />

    <div className='relative mx-auto max-w-275'>
      <div className='border-erasmus-gold/30 bg-erasmus-gold/12 text-erasmus-gold mb-8 inline-flex items-center gap-2.5 border px-4 py-1.5 text-[0.7rem] font-bold tracking-[0.2em] uppercase'>
        {t('hero_label')}
      </div>

      <h1 className='mb-6 font-serif text-[clamp(2.8rem,6vw,5.5rem)] leading-[1.05] font-bold text-white'>
        {t('hero_title_pre')}{' '}
        <em className='from-erasmus-gold to-erasmus-gold/30 bg-linear-to-r bg-clip-text text-transparent italic'>
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
  <section id={ka.id} className='border-erasmus-dark/10 border-b py-20 last:border-b-0'>
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
        <h2 className='text-erasmus-dark mb-3 font-serif text-[clamp(1.8rem,3.5vw,2.8rem)] leading-tight font-semibold'>
          {t(ka.titleKey)}
        </h2>
        <p className='text-erasmus-muted max-w-150 text-base leading-relaxed'>{t(ka.taglineKey)}</p>
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
          <span className='text-erasmus-muted font-normal'>{t(detail.labelKey)}</span>
          {t(detail.valueKey)}
        </div>
      ))}
    </div>

    {/* Activities grid */}
    <div className='mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
      {ka.activityKeys.map((activity) => (
        <div
          key={activity.titleKey}
          className='border-erasmus-dark/10 border border-l-4 bg-white p-7 transition-all hover:-translate-y-0.5 hover:shadow-lg'
          style={{ borderLeftColor: ka.color }}
        >
          <h3 className='mb-2 flex items-center gap-2.5 text-base font-semibold'>
            <span>{activity.icon}</span>
            {t(activity.titleKey)}
          </h3>
          <p className='text-erasmus-muted text-sm leading-relaxed'>{t(activity.descKey)}</p>
        </div>
      ))}
    </div>

    {/* Who benefits */}
    <div
      className='border-erasmus-dark/10 grid grid-cols-[auto_1fr] items-start gap-6 border p-8'
      style={{ background: `linear-gradient(135deg, ${ka.lightColor} 0%, #ffffff 100%)` }}
    >
      <div className='text-4xl'>{ka.whoIcon}</div>
      <div>
        <h3
          className='mb-2.5 text-[0.7rem] font-bold tracking-[0.16em] uppercase'
          style={{ color: ka.color }}
        >
          {t('who_heading')}
        </h3>
        <div className='flex flex-wrap gap-2'>
          {ka.whoTagKeys.map((tagKey) => (
            <span
              key={tagKey}
              className='border-erasmus-dark/10 text-erasmus-dark border bg-white px-3 py-1 text-sm'
            >
              {t(tagKey)}
            </span>
          ))}
        </div>
      </div>
    </div>
  </section>
);

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
                className='border-erasmus-dark/10 text-erasmus-muted border-b-2 px-4 py-3.5 text-left text-[0.72rem] font-bold tracking-[0.12em] uppercase'
              >
                {t(key)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {comparisonRows.map((row) => (
            <tr key={row.nameKey} className='hover:bg-bege-light transition-colors'>
              <td className='border-erasmus-dark/10 border-b px-4 py-4 align-top'>
                <div className='flex items-center gap-2 font-semibold'>
                  <span
                    className='h-2 w-2 shrink-0 rounded-full'
                    style={{ background: row.color }}
                  />
                  {t(row.nameKey)}
                </div>
              </td>
              <td className='border-erasmus-dark/10 border-b px-4 py-4 align-top leading-relaxed'>
                {t(row.focusKey)}
              </td>
              <td className='border-erasmus-dark/10 border-b px-4 py-4 align-top leading-relaxed'>
                {t(row.whoKey)}
              </td>
              <td className='border-erasmus-dark/10 border-b px-4 py-4 align-top leading-relaxed'>
                {t(row.durationKey)}
              </td>
              <td className='border-erasmus-dark/10 border-b px-4 py-4 align-top leading-relaxed'>
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
  <div className='bg-erasmus-blue -mx-4 grid grid-cols-1 items-center gap-8 px-8 py-16 text-white md:grid-cols-[1fr_auto] xl:-mx-8'>
    <div>
      <h3 className='mb-3 font-serif text-3xl font-semibold'>{t('youthpass_title')}</h3>
      <p className='max-w-125 text-sm leading-relaxed text-white/65'>{t('youthpass_desc')}</p>
    </div>
    <div className='bg-erasmus-gold text-erasmus-blue rounded-sm px-8 py-5 text-center text-sm font-bold whitespace-nowrap'>
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
      href={transformUrl(lng, SITE_GET_URLS.erasmus)}
      className='border-erasmus-blue text-erasmus-blue hover:bg-erasmus-blue inline-flex items-center gap-2 border-2 px-7 py-3 text-sm font-semibold transition-colors hover:text-white'
    >
      ← {t('back_link')}
    </Link>
  </div>
);

// ── Shared Components ──

const SectionEyebrow = ({ label }: { label: string }) => (
  <p className='text-erasmus-blue mb-3 flex items-center gap-2.5 text-[0.7rem] font-bold tracking-[0.2em] uppercase'>
    <span className='bg-erasmus-blue block h-0.5 w-7' />
    {label}
  </p>
);
