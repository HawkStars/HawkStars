import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import React from 'react';
import { Widget } from '../DashboardStats/Widget';
import type { DashboardDoc, UpcomingEvent } from './queries';

const COLLECTION_META: Record<DashboardDoc['collection'], { icon: string; label: string }> = {
  pages: { icon: '📄', label: 'Page' },
  news: { icon: '📰', label: 'News' },
  hawk_projects: { icon: '🚀', label: 'Project' },
  hawk_events: { icon: '📅', label: 'Event' },
};

const EmptyState: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className='text-sm text-gray-500 dark:text-gray-400'>{children}</p>
);

const rowLinkClasses =
  '-mx-2 flex items-center gap-3 rounded-md px-2 py-2.5 no-underline transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/60';

export type QuickAction = { href: string; icon: string; label: string };

export const QuickActions: React.FC<{ actions: QuickAction[] }> = ({ actions }) => {
  if (actions.length === 0) return null;

  return (
    <div className='grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5'>
      {actions.map((action) => (
        <Link
          key={action.href}
          href={action.href}
          className='group hover:border-green flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-800 no-underline shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100'
        >
          <span
            aria-hidden
            className='bg-green/10 group-hover:bg-green/20 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-lg transition-colors'
          >
            {action.icon}
          </span>
          {action.label}
        </Link>
      ))}
    </div>
  );
};

export const DocListWidget: React.FC<{
  title: string;
  icon: string;
  docs: DashboardDoc[];
  emptyText: string;
  hrefFor: (doc: DashboardDoc) => string;
}> = ({ title, icon, docs, emptyText, hrefFor }) => (
  <Widget title={title} icon={icon}>
    {docs.length === 0 ? (
      <EmptyState>{emptyText}</EmptyState>
    ) : (
      <ul className='flex flex-col divide-y divide-gray-100 dark:divide-gray-800'>
        {docs.map((doc) => {
          const meta = COLLECTION_META[doc.collection];
          return (
            <li key={`${doc.collection}-${doc.id}`}>
              <Link href={hrefFor(doc)} className={rowLinkClasses}>
                <span aria-hidden className='text-base'>
                  {meta.icon}
                </span>
                <div className='min-w-0 flex-1'>
                  <p className='truncate text-sm font-medium text-gray-800 dark:text-gray-100'>
                    {doc.title}
                  </p>
                  <p className='mt-0.5 text-xs text-gray-500 dark:text-gray-400'>
                    {meta.label} · edited{' '}
                    {formatDistanceToNow(new Date(doc.updatedAt), { addSuffix: true })}
                  </p>
                </div>
                {doc.status === 'draft' && (
                  <span className='shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'>
                    Draft
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    )}
  </Widget>
);

const dayFormatter = new Intl.DateTimeFormat('pt-PT', {
  day: '2-digit',
  timeZone: 'Europe/Lisbon',
});
const monthFormatter = new Intl.DateTimeFormat('en-GB', {
  month: 'short',
  timeZone: 'Europe/Lisbon',
});
const fullDateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  timeZone: 'Europe/Lisbon',
});

export const UpcomingEventsWidget: React.FC<{
  events: UpcomingEvent[];
  hrefFor: (event: UpcomingEvent) => string;
  allHref: string;
}> = ({ events, hrefFor, allHref }) => (
  <Widget
    title='Upcoming Events'
    icon='📅'
    action={
      <Link
        href={allHref}
        className='text-xs text-gray-600 no-underline hover:underline dark:text-gray-300'
      >
        View all →
      </Link>
    }
  >
    {events.length === 0 ? (
      <EmptyState>No upcoming events scheduled.</EmptyState>
    ) : (
      <ul className='flex flex-col gap-1'>
        {events.map((event) => {
          const start = new Date(event.date);
          const end = event.endDate ? new Date(event.endDate) : null;
          return (
            <li key={event.id}>
              <Link href={hrefFor(event)} className={rowLinkClasses}>
                <div className='bg-green flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg text-white'>
                  <span className='text-lg leading-none font-semibold'>
                    {dayFormatter.format(start)}
                  </span>
                  <span className='text-[10px] tracking-wide uppercase'>
                    {monthFormatter.format(start)}
                  </span>
                </div>
                <div className='min-w-0 flex-1'>
                  <p className='truncate text-sm font-medium text-gray-800 dark:text-gray-100'>
                    {event.heading}
                  </p>
                  <p className='mt-0.5 truncate text-xs text-gray-500 dark:text-gray-400'>
                    {end && end.getTime() !== start.getTime()
                      ? `${fullDateFormatter.format(start)} – ${fullDateFormatter.format(end)}`
                      : fullDateFormatter.format(start)}
                    {event.location && ` · ${event.location}`}
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    )}
  </Widget>
);

export type ShortcutGroup = {
  label: string;
  entities: { href: string; label: string }[];
};

/** Compact replacement for Payload's default grid of collection/global cards. */
export const CollectionShortcuts: React.FC<{ groups: ShortcutGroup[] }> = ({ groups }) => (
  <Widget title='Content' icon='🗂️'>
    <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
      {groups.map((group) => (
        <div key={group.label}>
          <h4 className='mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400'>
            {group.label}
          </h4>
          <ul className='flex flex-col'>
            {group.entities.map((entity) => (
              <li key={entity.href}>
                <Link
                  href={entity.href}
                  className='hover:text-green -mx-2 block rounded-md px-2 py-1.5 text-sm text-gray-700 no-underline transition-colors hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800/60'
                >
                  {entity.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </Widget>
);
