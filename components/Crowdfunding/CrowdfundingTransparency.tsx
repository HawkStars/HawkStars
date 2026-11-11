import { TFunction } from 'i18next';
import { LuArrowUpRight, LuCheck } from 'react-icons/lu';
import { Language } from '@/i18n/settings';
import { cn } from '@/lib/utils';
import { CrowdfundingSetting } from '@/payload-types';
import { CfSection, Container, Glow, Highlight, SectionEyebrow } from './ui';
import { formatEuro } from '@/lib/utils/currency';

type Props = { t: TFunction<string, string>; lng: Language } & Pick<
  CrowdfundingSetting,
  'campaignGoal' | 'projectGoal' | 'phases' | 'transparencyDocUrl'
>;

type PhaseStatus = 'done' | 'current' | 'next';
type TimelineItem = { id: string; title: string; period?: string | null; status: PhaseStatus };

/** What the first campaign goal pays for (Global Village 2026 presentation, cover + §3). */
const FUND_USES = [
  'licensing',
  'engineering',
  'works',
  'communication',
  'working_capital',
] as const;

/**
 * Fallback timeline while the "Campaign Phases" tab in Payload is empty. Source:
 * "FASES DO PROJETO" and the 2026–2036 schedule in the 2026 presentation (§7.2).
 */
const FALLBACK_TIMELINE: { key: string; status: PhaseStatus }[] = [
  { key: 'design', status: 'done' },
  { key: 'launch', status: 'done' },
  { key: 'campaign', status: 'current' },
  { key: 'works', status: 'next' },
  { key: 'build', status: 'next' },
];

const getTimeline = (
  phases: CrowdfundingSetting['phases'],
  t: TFunction<string, string>
): TimelineItem[] => {
  if (phases && phases.length > 0) {
    const firstOpen = phases.findIndex((phase) => !phase.completed);
    return phases.map((phase, index) => ({
      id: phase.id ?? String(index),
      title: phase.title,
      period: phase.description,
      status: phase.completed ? 'done' : index === firstOpen ? 'current' : 'next',
    }));
  }
  return FALLBACK_TIMELINE.map(({ key, status }) => ({
    id: key,
    title: t(`transparency.timeline.${key}.title`),
    period: t(`transparency.timeline.${key}.period`),
    status,
  }));
};

const CrowdfundingTransparency = ({
  t,
  campaignGoal,
  projectGoal,
  phases,
  transparencyDocUrl,
  lng,
}: Props) => {
  const timeline = getTimeline(phases, t);

  return (
    <CfSection id='transparency'>
      <Glow className='-right-40 bottom-0 size-120 opacity-25' />
      <Container className='grid gap-14 lg:grid-cols-2 lg:gap-20'>
        <div className='flex flex-col gap-5'>
          <SectionEyebrow>{t('transparency.badge')}</SectionEyebrow>
          <h2 className='text-h2_semibold text-white'>
            {t('transparency.title_prefix')}{' '}
            <Highlight>{t('transparency.title_highlight')}</Highlight>
          </h2>
          <p className='text-crowdfunding-muted leading-relaxed'>
            {t('transparency.description', {
              campaignGoal: formatEuro(campaignGoal ?? 0, lng),
              projectGoal: formatEuro(projectGoal ?? 0, lng),
            })}
          </p>

          <div className='bg-crowdfunding-surface border-crowdfunding-line mt-4 rounded-xl border p-6'>
            <h3 className='text-h3_semibold text-white'>
              {t('transparency.uses_title', { campaignGoal: formatEuro(campaignGoal ?? 0, lng) })}
            </h3>
            <ul className='mt-4 flex flex-col gap-3'>
              {FUND_USES.map((key) => (
                <li key={key} className='flex items-start gap-3 text-sm text-white/85'>
                  <span className='bg-crowdfunding-accent/15 text-crowdfunding-accent mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full'>
                    <LuCheck aria-hidden='true' className='size-3' />
                  </span>
                  {t(`transparency.uses.${key}`)}
                </li>
              ))}
            </ul>
          </div>

          {transparencyDocUrl && (
            <a
              href={transparencyDocUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='text-crowdfunding-accent inline-flex w-fit items-center gap-1 text-sm font-semibold underline-offset-4 hover:underline'
            >
              {t('transparency.cta_money')}
              <LuArrowUpRight aria-hidden='true' className='size-4' />
            </a>
          )}
        </div>

        <div>
          <h3 className='text-h2_bold text-white'>{t('transparency.timeline_title')}</h3>
          <ol className='mt-8 flex flex-col'>
            {timeline.map((item, index) => (
              <li key={item.id} className='relative flex gap-5 pb-8 last:pb-0'>
                {index < timeline.length - 1 && (
                  <span
                    aria-hidden='true'
                    className={cn(
                      'absolute top-9 bottom-0 left-4.25 w-px',
                      item.status === 'done' ? 'bg-crowdfunding-accent/60' : 'bg-white/15'
                    )}
                  />
                )}
                <span
                  className={cn(
                    'relative flex size-9 shrink-0 items-center justify-center rounded-full border text-sm font-semibold',
                    item.status === 'done' &&
                      'border-crowdfunding-accent bg-crowdfunding-accent text-crowdfunding-bg',
                    item.status === 'current' &&
                      'border-crowdfunding-accent text-crowdfunding-accent bg-crowdfunding-bg ring-crowdfunding-accent/20 ring-4',
                    item.status === 'next' && 'bg-crowdfunding-bg border-white/20 text-white/60'
                  )}
                >
                  {item.status === 'done' ? (
                    <LuCheck aria-hidden='true' className='size-4' />
                  ) : (
                    index + 1
                  )}
                </span>
                <div className='flex flex-col gap-1 pt-1.5'>
                  <p className='flex flex-wrap items-center gap-2 font-semibold text-white'>
                    {item.title}
                    {item.status === 'current' && (
                      <span className='bg-crowdfunding-accent-strong rounded-full px-2.5 py-0.5 text-xs font-semibold text-white'>
                        {t('transparency.now')}
                      </span>
                    )}
                  </p>
                  {item.period && <p className='text-crowdfunding-muted text-sm'>{item.period}</p>}
                  <span className='sr-only'>{t(`transparency.status.${item.status}`)}</span>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </CfSection>
  );
};

export default CrowdfundingTransparency;
