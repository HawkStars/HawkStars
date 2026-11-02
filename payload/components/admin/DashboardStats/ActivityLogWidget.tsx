'use client';

import { useTranslation } from '@payloadcms/ui';
import React, { useCallback, useEffect, useState } from 'react';
import { toDashboardLang } from '../dashboardLang';
import { STATS_COPY } from './copy';
import { Widget, WidgetSpinner } from './Widget';
import type { ActivityEntry, ActorRef } from './types';

const SITUATION_META: Record<ActivityEntry['situation'], { icon: string; classes: string }> = {
  login: {
    icon: '🔑',
    classes: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  },
  create: {
    icon: '➕',
    classes: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  },
  update: {
    icon: '✏️',
    classes: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  },
  delete: {
    icon: '🗑️',
    classes: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  },
  message: {
    icon: '💬',
    classes: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  },
  other: {
    icon: 'ℹ️',
    classes: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  },
};

const actorName = (actor: ActivityEntry['actor']): string | null => {
  if (!actor || typeof actor !== 'object') return null;
  const a = actor as ActorRef;
  return a.name || a.email || null;
};

const timeAgo = (iso: string, locale: string): string => {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '';
  const relative = new Intl.RelativeTimeFormat(locale, { numeric: 'auto', style: 'short' });
  const seconds = Math.floor((Date.now() - then) / 1000);
  if (seconds < 60) return relative.format(0, 'second');
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return relative.format(-minutes, 'minute');
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return relative.format(-hours, 'hour');
  const days = Math.floor(hours / 24);
  if (days < 7) return relative.format(-days, 'day');
  return new Date(iso).toLocaleDateString(locale);
};

export const ActivityLogWidget: React.FC = () => {
  const { i18n } = useTranslation();
  const {
    intlLocale,
    error: errorLabel,
    activity: copy,
  } = STATS_COPY[toDashboardLang(i18n.language)];
  const [entries, setEntries] = useState<ActivityEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/activity-log?limit=25');
      if (!res.ok) throw new Error(res.statusText);
      const data = await res.json();

      // GET /api/notifications returns { notifications, unreadCount, totalDocs }
      setEntries((data.notifications as ActivityEntry[]) ?? []);
    } catch {
      setError(copy.fetchFailed);
    } finally {
      setLoading(false);
    }
  }, [copy.fetchFailed]);

  useEffect(() => {
    const prepareLoad = async () => {
      await load();
    };
    prepareLoad();
  }, [load]);

  const body = () => {
    if (loading) return <WidgetSpinner label={copy.loading} />;
    if (error)
      return (
        <p className='text-sm text-red-500'>
          {errorLabel}: {error}
        </p>
      );
    if (entries.length === 0) return <p className='text-sm text-gray-500'>{copy.empty}</p>;

    return (
      <ul className='flex max-h-128 flex-col divide-y divide-gray-100 overflow-y-auto dark:divide-gray-800'>
        {entries.map((entry) => {
          const situation = SITUATION_META[entry.situation] ? entry.situation : 'other';
          const meta = SITUATION_META[situation];
          const who = actorName(entry.actor);
          const row = (
            <div className='flex items-start gap-3 py-3'>
              <span
                className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm ${meta.classes}`}
                aria-hidden
                title={copy.situations[situation]}
              >
                {meta.icon}
              </span>
              <div className='min-w-0 flex-1'>
                <p className='truncate text-sm font-medium text-gray-800 dark:text-gray-100'>
                  {entry.title}
                </p>
                <p className='mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-gray-500 dark:text-gray-400'>
                  {who && (
                    <span className='font-medium text-gray-600 dark:text-gray-300'>{who}</span>
                  )}
                  {who && <span aria-hidden>·</span>}
                  <span>{timeAgo(entry.createdAt, intlLocale)}</span>
                </p>
              </div>
            </div>
          );

          return (
            <li key={entry.id}>
              {entry.link ? (
                <a
                  href={entry.link}
                  className='-mx-2 block rounded-md px-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/60'
                >
                  {row}
                </a>
              ) : (
                <div className='px-0'>{row}</div>
              )}
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <Widget
      title={copy.title}
      icon='📜'
      action={
        <button
          type='button'
          onClick={load}
          className='rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800'
        >
          {copy.refresh}
        </button>
      }
    >
      {body()}
    </Widget>
  );
};

export default ActivityLogWidget;
