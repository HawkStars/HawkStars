'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Widget, WidgetSpinner } from './Widget';
import type { ActivityEntry, ActorRef } from './types';

const SITUATION_META: Record<
  ActivityEntry['situation'],
  { icon: string; label: string; classes: string }
> = {
  login: {
    icon: '🔑',
    label: 'Login',
    classes: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  },
  create: {
    icon: '➕',
    label: 'Created',
    classes: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  },
  update: {
    icon: '✏️',
    label: 'Updated',
    classes: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  },
  delete: {
    icon: '🗑️',
    label: 'Deleted',
    classes: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  },
  message: {
    icon: '💬',
    label: 'Message',
    classes: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  },
  other: {
    icon: 'ℹ️',
    label: 'Event',
    classes: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  },
};

const actorName = (actor: ActivityEntry['actor']): string | null => {
  if (!actor || typeof actor !== 'object') return null;
  const a = actor as ActorRef;
  return a.name || a.email || null;
};

const timeAgo = (iso: string): string => {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '';
  const seconds = Math.floor((Date.now() - then) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
};

export const ActivityLogWidget: React.FC = () => {
  const [entries, setEntries] = useState<ActivityEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/notifications?limit=25');
      if (!res.ok) throw new Error('Failed to fetch activity');
      const data = await res.json();

      setEntries((data.docs as ActivityEntry[]) ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [setError, setEntries, setLoading]);

  useEffect(() => {
    const prepareLoad = async () => {
      await load();
    };
    prepareLoad();
  }, [load]);

  const body = () => {
    if (loading) return <WidgetSpinner label='Loading activity…' />;
    if (error) return <p className='text-sm text-red-500'>Error: {error}</p>;
    if (entries.length === 0)
      return <p className='text-sm text-gray-500'>No activity recorded yet.</p>;

    return (
      <ul className='flex max-h-128 flex-col divide-y divide-gray-100 overflow-y-auto dark:divide-gray-800'>
        {entries.map((entry) => {
          const meta = SITUATION_META[entry.situation] ?? SITUATION_META.other;
          const who = actorName(entry.actor);
          const row = (
            <div className='flex items-start gap-3 py-3'>
              <span
                className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm ${meta.classes}`}
                aria-hidden
                title={meta.label}
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
                  <span>{timeAgo(entry.createdAt)}</span>
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
      title='Activity Log'
      icon='📜'
      action={
        <button
          type='button'
          onClick={load}
          className='rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800'
        >
          ↻ Refresh
        </button>
      }
    >
      {body()}
    </Widget>
  );
};

export default ActivityLogWidget;
