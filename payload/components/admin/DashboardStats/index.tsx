'use client';

import React, { useEffect, useState } from 'react';

type Stats = {
  collections: {
    artCollection: number;
    boardMembers: number;
    contributions: number;
    curators: number;
    hawkProjects: number;
    partners: number;
    pages: number;
    media: number;
    users: number;
  };
  contributions: {
    totalValue: number;
    confirmedValue: number;
    totalCount: number;
    confirmedCount: number;
    byType: Record<string, { count: number; total: number }>;
  };
};

const StatCard: React.FC<{
  label: string;
  value: string | number;
  subtitle?: string;
  highlight?: boolean;
  icon?: string;
}> = ({ label, value, subtitle, highlight, icon }) => (
  <div
    className={`flex flex-col gap-2 rounded-lg border p-4 ${
      highlight
        ? 'border-green-400 bg-green-50 dark:border-green-600 dark:bg-green-900/20'
        : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50'
    }`}
  >
    <span className='flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400'>
      {icon && <span>{icon}</span>}
      {label}
    </span>
    <span
      className={`text-2xl font-semibold ${
        highlight ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-gray-100'
      }`}
    >
      {value}
    </span>
    {subtitle && <span className='text-xs text-gray-500 dark:text-gray-500'>{subtitle}</span>}
  </div>
);

export const DashboardStats: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/dashboard-stats');
        if (!response.ok) throw new Error('Failed to fetch stats');
        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatCurrency = (value: number) =>
    `€${value.toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  if (loading) {
    return (
      <div className='mt-6 p-6'>
        <h2 className='mb-6 text-2xl font-semibold text-gray-800 dark:text-gray-200'>
          📊 Dashboard Statistics
        </h2>
        <div className='flex items-center gap-3 text-gray-500'>
          <div className='h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500' />
          Loading statistics...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='mt-6 p-6'>
        <h2 className='mb-6 text-2xl font-semibold text-gray-800 dark:text-gray-200'>
          📊 Dashboard Statistics
        </h2>
        <p className='text-red-500'>Error: {error}</p>
      </div>
    );
  }

  if (!stats) return null;

  // Chair types for special display
  const chairTypes = ['OFFICE_CHAIR', 'SIMULATOR_CHAIR', 'LOUNGE_CHAIR', 'AUDITORIUM_CHAIR'];
  const chairStats = Object.entries(stats.contributions.byType).filter(([type]) =>
    chairTypes.includes(type)
  );
  const otherContributions = Object.entries(stats.contributions.byType).filter(
    ([type]) => !chairTypes.includes(type)
  );

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

  return (
    <div className='mt-6 space-y-8 p-6'>
      <h2 className='text-center text-3xl font-semibold text-gray-800 dark:text-gray-200'>
        📊 Dashboard Statistics
      </h2>

      {/* Contribution Summary */}
      <section>
        <h3 className='mb-4 flex items-center gap-2 text-lg font-medium text-gray-700 dark:text-gray-300'>
          💰 Contribution Summary
        </h3>
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
            label='Confirmed Donations'
            value={formatCurrency(stats.contributions.confirmedValue)}
            subtitle={`${stats.contributions.confirmedCount} confirmed`}
            highlight
          />
          <StatCard
            icon='⏳'
            label='Pending Donations'
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
          <h3 className='mb-4 flex items-center gap-2 text-lg font-medium text-gray-700 dark:text-gray-300'>
            🪑 Chairs by Type
          </h3>
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
          <h3 className='mb-4 flex items-center gap-2 text-lg font-medium text-gray-700 dark:text-gray-300'>
            🎁 Other Contributions
          </h3>
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
        <h3 className='mb-4 flex items-center gap-2 text-lg font-medium text-gray-700 dark:text-gray-300'>
          📁 Collection Counts
        </h3>
        <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5'>
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

export default DashboardStats;
