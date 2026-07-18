'use client';

import React from 'react';
import { Widget, WidgetSpinner } from './Widget';
import type { Stats, StatusCounts } from './types';

const STATUS_META: {
  key: keyof StatusCounts;
  label: string;
  icon: string;
  classes: string;
}[] = [
  {
    key: 'draft',
    label: 'Draft',
    icon: '📝',
    classes: 'border-gray-300 bg-gray-50 text-gray-700 dark:border-gray-600 dark:bg-gray-800/50 dark:text-gray-300',
  },
  {
    key: 'in_review',
    label: 'In Review',
    icon: '🕵️',
    classes:
      'border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-600 dark:bg-amber-900/20 dark:text-amber-300',
  },
  {
    key: 'published',
    label: 'Published',
    icon: '🌐',
    classes:
      'border-green-300 bg-green-50 text-green-700 dark:border-green-600 dark:bg-green-900/20 dark:text-green-300',
  },
];

const StatusRow: React.FC<{ label: string; icon: string; counts: StatusCounts }> = ({
  label,
  icon,
  counts,
}) => (
  <div className='flex flex-col gap-2 rounded-lg border border-gray-200 p-4 dark:border-gray-700'>
    <span className='flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200'>
      <span aria-hidden>{icon}</span>
      {label}
    </span>
    <div className='grid grid-cols-3 gap-2'>
      {STATUS_META.map((s) => (
        <div
          key={s.key}
          className={`flex flex-col items-center gap-0.5 rounded-md border px-2 py-2 ${s.classes}`}
        >
          <span className='text-lg font-semibold'>{counts[s.key]}</span>
          <span className='flex items-center gap-1 text-[11px]'>
            <span aria-hidden>{s.icon}</span>
            {s.label}
          </span>
        </div>
      ))}
    </div>
  </div>
);

export const ContentStatusWidget: React.FC<{
  stats: Stats | null;
  loading: boolean;
  error: string | null;
}> = ({ stats, loading, error }) => {
  const body = () => {
    if (loading) return <WidgetSpinner label='Loading content status…' />;
    if (error) return <p className='text-sm text-red-500'>Error: {error}</p>;
    if (!stats) return null;

    return (
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
        <StatusRow label='Pages' icon='📄' counts={stats.contentStatus.pages} />
        <StatusRow label='News' icon='📰' counts={stats.contentStatus.news} />
        <StatusRow label='Hawk Projects' icon='🚀' counts={stats.contentStatus.hawkProjects} />
      </div>
    );
  };

  return (
    <Widget title='Content Status' icon='🗂️'>
      {body()}
    </Widget>
  );
};

export default ContentStatusWidget;
