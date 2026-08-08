'use client';

import { formatCurrency } from '@/lib/utils/currency';
import React from 'react';
import { StatCard, Widget, WidgetSpinner } from './Widget';
import type { Stats } from './types';

const CHAIR_TYPES = ['OFFICE_CHAIR', 'SIMULATOR_CHAIR', 'LOUNGE_CHAIR', 'AUDITORIUM_CHAIR'];

const typeLabels: Record<string, string> = {
  BANK: 'Bank Transfer',
  CRYPTO: 'Cryptocurrency',
  WALL_NAME_SINGULAR: 'Individual Wall Name',
  WALL_NAME_COMPANY: 'Company Wall Name',
  OFFICE_CHAIR: 'Office Chair',
  SIMULATOR_CHAIR: 'Simulator Chair',
  LOUNGE_CHAIR: 'Lounge Chair',
  AUDITORIUM_CHAIR: 'Auditorium Chair',
  BUILDING_NAMING: 'Building Naming',
  TRAINING_ROOM_NAMING: 'Training Room Naming',
};

export const StatisticsWidget: React.FC<{
  stats: Stats | null;
  loading: boolean;
  error: string | null;
}> = ({ stats, loading, error }) => {
  const body = () => {
    if (loading) return <WidgetSpinner label='Loading statistics…' />;
    if (error) return <p className='text-sm text-red-500'>Error: {error}</p>;
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
            💰 Contribution Summary
          </h4>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
            <StatCard
              icon='💵'
              label='Total Donations'
              value={formatCurrency(stats.contributions.totalValue)}
              subtitle={`${stats.contributions.totalCount} contributions`}
              highlight
            />
            <StatCard
              icon='✅'
              label='Confirmed'
              value={formatCurrency(stats.contributions.confirmedValue)}
              subtitle={`${stats.contributions.confirmedCount} confirmed`}
              highlight
            />
            <StatCard
              icon='⏳'
              label='Pending'
              value={formatCurrency(
                stats.contributions.totalValue - stats.contributions.confirmedValue
              )}
              subtitle={`${stats.contributions.totalCount - stats.contributions.confirmedCount} pending`}
            />
            <StatCard
              icon='📈'
              label='Avg. Contribution'
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
              🪑 Chairs by Type
            </h4>
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
              {chairStats.map(([type, data]) => (
                <StatCard
                  key={type}
                  icon='🪑'
                  label={typeLabels[type] || type}
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
              🎁 Other Contributions
            </h4>
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
              {otherContributions.map(([type, data]) => (
                <StatCard
                  key={type}
                  label={typeLabels[type] || type}
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
            📁 Collection Counts
          </h4>
          <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4'>
            <StatCard icon='🎨' label='Art Collections' value={stats.collections.artCollection} />
            <StatCard icon='👥' label='Board Members' value={stats.collections.boardMembers} />
            <StatCard icon='🎯' label='Curators' value={stats.collections.curators} />
            <StatCard icon='🚀' label='Hawk Projects' value={stats.collections.hawkProjects} />
            <StatCard icon='🤝' label='Partners' value={stats.collections.partners} />
            <StatCard icon='📄' label='Pages' value={stats.collections.pages} />
            <StatCard icon='🖼️' label='Media Files' value={stats.collections.media} />
            <StatCard icon='👤' label='Users' value={stats.collections.users} />
          </div>
        </section>
      </div>
    );
  };

  return (
    <Widget title='Dashboard Statistics' icon='📊'>
      {body()}
    </Widget>
  );
};

export default StatisticsWidget;
