'use client';

import { formatCurrency } from '@/lib/utils/currency';
import { useTranslation } from '@payloadcms/ui';
import React from 'react';
import { toDashboardLang } from '../dashboardLang';
import { STATS_COPY, type StatsError } from './copy';
import { StatCard, Widget, WidgetSpinner } from './Widget';
import type { Stats } from './types';

const CHAIR_TYPES = ['OFFICE_CHAIR', 'SIMULATOR_CHAIR', 'LOUNGE_CHAIR', 'AUDITORIUM_CHAIR'];

export const StatisticsWidget: React.FC<{
  stats: Stats | null;
  loading: boolean;
  error?: StatsError | null;
}> = ({ stats, loading, error }) => {
  const { i18n } = useTranslation();
  const { error: errorLabel, statistics: copy } = STATS_COPY[toDashboardLang(i18n.language)];
  const typeLabel = (type: string) => copy.contributionTypes[type] || type;

  const body = () => {
    if (loading) return <WidgetSpinner label={copy.loading} />;
    if (error)
      return (
        <p className='text-sm text-red-500'>
          {errorLabel}: {copy.errors[error]}
        </p>
      );
    if (!stats || !stats.contributions) return null;

    const chairStats = Object.entries(stats.contributions.byType).filter(([type]) =>
      CHAIR_TYPES.includes(type)
    );
    const otherContributions = Object.entries(stats.contributions.byType).filter(
      ([type]) => !CHAIR_TYPES.includes(type)
    );

    return (
      <div className='space-y-8'>
        {/* Contribution Summary */}
        <section>
          <h4 className='mb-4 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300'>
            💰 {copy.contributionSummary}
          </h4>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
            <StatCard
              icon='💵'
              label={copy.totalDonations}
              value={formatCurrency(stats.contributions.totalValue)}
              subtitle={copy.contributionsCount(stats.contributions.totalCount)}
              highlight
            />
            <StatCard
              icon='✅'
              label={copy.confirmed}
              value={formatCurrency(stats.contributions.confirmedValue)}
              subtitle={copy.confirmedCount(stats.contributions.confirmedCount)}
              highlight
            />
            <StatCard
              icon='⏳'
              label={copy.pending}
              value={formatCurrency(
                stats.contributions.totalValue - stats.contributions.confirmedValue
              )}
              subtitle={copy.pendingCount(
                stats.contributions.totalCount - stats.contributions.confirmedCount
              )}
            />
            <StatCard
              icon='📈'
              label={copy.average}
              value={formatCurrency(
                stats.contributions.totalCount > 0
                  ? stats.contributions.totalValue / stats.contributions.totalCount
                  : 0
              )}
            />
          </div>
        </section>

        {/* Chairs by Type */}
        {chairStats.length > 0 && (
          <section>
            <h4 className='mb-4 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300'>
              🪑 {copy.chairsByType}
            </h4>
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
              {chairStats.map(([type, data]) => (
                <StatCard
                  key={type}
                  icon='🪑'
                  label={typeLabel(type)}
                  value={data.count}
                  subtitle={formatCurrency(data.total)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Other Contributions */}
        {otherContributions.length > 0 && (
          <section>
            <h4 className='mb-4 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300'>
              🎁 {copy.otherContributions}
            </h4>
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
              {otherContributions.map(([type, data]) => (
                <StatCard
                  key={type}
                  label={typeLabel(type)}
                  value={data.count}
                  subtitle={formatCurrency(data.total)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Collection Counts */}
        <section>
          <h4 className='mb-4 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300'>
            📁 {copy.collectionCounts}
          </h4>
          <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4'>
            <StatCard
              icon='🎨'
              label={copy.collections.artCollection}
              value={stats.collections.artCollection}
            />
            <StatCard
              icon='👥'
              label={copy.collections.boardMembers}
              value={stats.collections.boardMembers}
            />
            <StatCard
              icon='🖌️'
              label={copy.collections.artists}
              value={stats.collections.artists}
            />
            <StatCard
              icon='🎯'
              label={copy.collections.curators}
              value={stats.collections.curators}
            />
            <StatCard
              icon='🚀'
              label={copy.collections.hawkProjects}
              value={stats.collections.hawkProjects}
            />
            <StatCard
              icon='🤝'
              label={copy.collections.partners}
              value={stats.collections.partners}
            />
            <StatCard icon='📄' label={copy.collections.pages} value={stats.collections.pages} />
            <StatCard icon='🖼️' label={copy.collections.media} value={stats.collections.media} />
            <StatCard icon='👤' label={copy.collections.users} value={stats.collections.users} />
          </div>
        </section>
      </div>
    );
  };

  return (
    <Widget title={copy.title} icon='📊'>
      {body()}
    </Widget>
  );
};

export default StatisticsWidget;
