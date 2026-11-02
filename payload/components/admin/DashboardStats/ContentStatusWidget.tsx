'use client';

import { useTranslation } from '@payloadcms/ui';
import React from 'react';
import { toDashboardLang } from '../dashboardLang';
import { STATS_COPY, type StatsError } from './copy';
import { Widget, WidgetSpinner } from './Widget';
import type { Stats, StatusCounts } from './types';

const STATUS_META: {
  key: keyof StatusCounts;
  icon: string;
  classes: string;
}[] = [
  {
    key: 'draft',
    icon: '📝',
    classes:
      'border-gray-300 bg-gray-50 text-gray-700 dark:border-gray-600 dark:bg-gray-800/50 dark:text-gray-300',
  },
  {
    key: 'published',
    icon: '🌐',
    classes:
      'border-green-300 bg-green-50 text-green-700 dark:border-green-600 dark:bg-green-900/20 dark:text-green-300',
  },
];

const CONTENT_ICONS = { pages: '📄', news: '📰', hawkProjects: '🚀' } as const;

const StatusRow: React.FC<{
  label: string;
  icon: string;
  counts: StatusCounts;
  statusLabels: Record<keyof StatusCounts, string>;
}> = ({ label, icon, counts, statusLabels }) => (
  <div className='flex flex-col gap-2 rounded-lg border border-gray-200 p-4 dark:border-gray-700'>
    <span className='flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200'>
      <span aria-hidden>{icon}</span>
      {label}
    </span>
    <div className='grid grid-cols-2 gap-2'>
      {STATUS_META.map((s) => (
        <div
          key={s.key}
          className={`flex flex-col items-center gap-0.5 rounded-md border px-2 py-2 ${s.classes}`}
        >
          <span className='text-lg font-semibold'>{counts[s.key]}</span>
          <span className='flex items-center gap-1 text-[11px]'>
            <span aria-hidden>{s.icon}</span>
            {statusLabels[s.key]}
          </span>
        </div>
      ))}
    </div>
  </div>
);

export const ContentStatusWidget: React.FC<{
  stats: Stats | null;
  loading: boolean;
  error?: StatsError | null;
}> = ({ stats, loading, error }) => {
  const { i18n } = useTranslation();
  const {
    error: errorLabel,
    statistics: { errors },
    contentStatus: copy,
  } = STATS_COPY[toDashboardLang(i18n.language)];

  const body = () => {
    if (loading) return <WidgetSpinner label={copy.loading} />;
    if (error)
      return (
        <p className='text-sm text-red-500'>
          {errorLabel}: {errors[error]}
        </p>
      );
    if (!stats) return null;

    return (
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
        {(['pages', 'news', 'hawkProjects'] as const).map((key) => (
          <StatusRow
            key={key}
            label={copy.collections[key]}
            icon={CONTENT_ICONS[key]}
            counts={stats.contentStatus[key]}
            statusLabels={copy.statuses}
          />
        ))}
      </div>
    );
  };

  return (
    <Widget title={copy.title} icon='🗂️'>
      {body()}
    </Widget>
  );
};

export default ContentStatusWidget;
