'use client';

import { LuHandCoins, LuTarget, LuUsers } from 'react-icons/lu';
import { useLanguageCookie } from '@/utils/contexts/AppProvider';
import { useTranslation } from '@/i18n/client';
import { formatEuro } from '@/lib/utils/currency';
import { cn } from '@/lib/utils';
import { HawkStarsSection, PageHero } from '@/components/layout';
import ContributionProgressBar from './ContributionProgressBar';
import {
  CONTRIBUTION_COLOR,
  CONTRIBUTION_FAMILIES,
  ContributionTypeTotal,
  PROJECT_GOAL,
} from './config';

type ContributionProjectGoalProps = {
  totals: ContributionTypeTotal[];
  projectGoal?: number;
};

/**
 * The transparency page's top half: a green header band with the page's purpose, then a
 * separate white "data" panel — headline figures, the per-type progress bar and its
 * legend grouped by family.
 */
const ContributionProjectGoal = ({
  totals,
  projectGoal = PROJECT_GOAL,
}: ContributionProjectGoalProps) => {
  const lng = useLanguageCookie();
  const { t } = useTranslation(lng, 'transparency');

  const raised = totals.reduce((sum, { sum: value }) => sum + value, 0);
  const count = totals.reduce((sum, { count: n }) => sum + n, 0);
  const remaining = Math.max(projectGoal - raised, 0);
  const percent = (value: number, of: number) =>
    new Intl.NumberFormat(lng === 'en' ? 'en-US' : 'pt-PT', {
      style: 'percent',
      maximumFractionDigits: 1,
    }).format(of > 0 ? value / of : 0);
  const goalShare = percent(raised, projectGoal);

  const byType = new Map(totals.map((entry) => [entry.type, entry]));
  const typeLabel = (type: string) => t(`contribution_type.${type}`, { defaultValue: type });

  const segments = totals.map(({ type, sum }) => ({
    type,
    value: sum,
    label: typeLabel(type),
    title: `${typeLabel(type)} · ${formatEuro(sum, lng)}`,
  }));

  const stats = [
    { icon: LuUsers, label: t('summary.contributions'), value: String(count) },
    {
      icon: LuTarget,
      label: t('summary.remaining'),
      value: remaining > 0 ? formatEuro(remaining, lng) : t('summary.goal_reached'),
    },
  ];

  return (
    <>
      <PageHero
        variant='green'
        eyebrow={t('eyebrow')}
        title={t('title')}
        description={t('description')}
      />

      <HawkStarsSection spacing='default'>
        <div className='card-md border-bege-dark border bg-white p-6 sm:p-8 lg:p-10'>
          {/* Headline figures */}
          <div className='flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between'>
            <div>
              <p className='text-eyebrow text-green flex items-center gap-2'>
                <LuHandCoins aria-hidden='true' className='size-4' />
                {t('summary.raised')}
              </p>
              <p className='mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1'>
                <span className='font-display text-green text-5xl leading-none font-semibold tabular-nums lg:text-6xl'>
                  {formatEuro(raised, lng)}
                </span>
                <span className='text-body_regular text-black/70'>
                  {t('summary.of_goal', { goal: formatEuro(projectGoal, lng) })}
                </span>
              </p>
            </div>

            <dl className='grid grid-cols-2 gap-3 sm:gap-4'>
              {stats.map(({ icon: Icon, label, value }) => (
                <div key={label} className='bg-bege-light rounded-lg px-4 py-3 sm:px-5'>
                  <dt className='flex items-center gap-1.5 text-xs font-medium text-black/60'>
                    <Icon aria-hidden='true' className='size-3.5' />
                    {label}
                  </dt>
                  <dd className='font-display mt-1 text-2xl leading-none font-semibold tabular-nums'>
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Progress */}
          <div className='mt-8'>
            <div className='mb-2 flex justify-between text-sm font-medium text-black/70'>
              <span>{goalShare}</span>
              <span>{formatEuro(projectGoal, lng)}</span>
            </div>
            <ContributionProgressBar
              segments={segments}
              projectGoal={projectGoal}
              label={t('summary.progress_label', { percent: goalShare })}
            />
          </div>

          {/* Mix of what has been raised (scaled to the total, so every colour is
              readable even while the goal bar is still short), then its legend. */}
          <div className='border-bege-dark mt-10 border-t pt-8'>
            <h2 className='text-eyebrow mb-4 text-black/60'>{t('summary.breakdown')}</h2>
            {raised > 0 && (
              <ContributionProgressBar
                segments={segments}
                projectGoal={raised}
                label={t('summary.breakdown')}
                className='mb-8 h-3'
              />
            )}
            <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
              {CONTRIBUTION_FAMILIES.map(({ family, types }) => (
                <div key={family}>
                  <h3 className='text-body_semibold mb-3'>{t(`families.${family}`)}</h3>
                  <ul className='flex flex-col gap-2.5'>
                    {types.map((type) => {
                      const entry = byType.get(type);
                      const value = entry?.sum ?? 0;
                      return (
                        <li key={type} className='flex items-start gap-2.5 text-sm'>
                          {/* Types with nothing yet are muted via the swatch and a lighter
                              (still 4.5:1) text colour — never `opacity` on the text. */}
                          <span
                            aria-hidden='true'
                            className={cn(
                              'mt-1 size-3 shrink-0 rounded-sm',
                              CONTRIBUTION_COLOR[type],
                              value === 0 && 'opacity-35'
                            )}
                          />
                          <span
                            className={cn(
                              'flex flex-1 flex-col',
                              value === 0 ? 'text-black/60' : 'text-black'
                            )}
                          >
                            <span className={cn(value > 0 && 'text-black/80')}>
                              {typeLabel(type)}
                            </span>
                            <span className={cn('tabular-nums', value > 0 && 'font-semibold')}>
                              {formatEuro(value, lng)}
                              {value > 0 && (
                                <span className='ml-1.5 font-normal text-black/60'>
                                  · {percent(value, raised)}
                                </span>
                              )}
                            </span>
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </HawkStarsSection>
    </>
  );
};

export default ContributionProjectGoal;
