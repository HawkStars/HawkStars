import type { DashboardViewServerProps } from '@payloadcms/next/views';
import { getTranslation } from '@payloadcms/translations';
import { Gutter } from '@payloadcms/ui';
import { formatAdminURL } from '@payloadcms/ui/shared';
import React, { Suspense } from 'react';
import { ActivityLogWidget } from '../DashboardStats/ActivityLogWidget';
import StatsWrapper from '../DashboardStats/stats/StatsWrapper';
import { getDrafts, getRecentDocs, getUpcomingEvents } from './queries';
import {
  CollectionShortcuts,
  DocListWidget,
  QuickActions,
  type QuickAction,
  type ShortcutGroup,
  UpcomingEventsWidget,
} from './sections';

const QUICK_ACTIONS: { slug: string; icon: string; label: string }[] = [
  { slug: 'news', icon: '📰', label: 'New news post' },
  { slug: 'hawk_projects', icon: '🚀', label: 'New project' },
  { slug: 'hawk_events', icon: '📅', label: 'New event' },
  { slug: 'pages', icon: '📄', label: 'New page' },
  { slug: 'media', icon: '🖼️', label: 'Upload media' },
];

const USEFUL_LINKS = [
  { href: 'https://www.youtube.com/watch?v=0qDAn7jQOyc', label: 'Tutorial' },
  {
    href: 'https://6936ae02571a354f4f7c288f-lepszhgmbl.chromatic.com/',
    label: 'Componentes Existentes',
  },
];

const todayFormatter = new Intl.DateTimeFormat('en-GB', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'Europe/Lisbon',
});

const greetingFor = (date: Date) => {
  const hour = Number(
    new Intl.DateTimeFormat('en-GB', { hour: 'numeric', timeZone: 'Europe/Lisbon' }).format(date)
  );
  if (hour < 12) return 'Good morning';
  if (hour < 19) return 'Good afternoon';
  return 'Good evening';
};

/**
 * Replaces Payload's default dashboard view (`admin.components.views.dashboard`).
 *
 * Every account sees the greeting, quick actions, recent edits, unpublished
 * drafts, upcoming events and the collection shortcuts. Admins additionally get
 * the donation/collection statistics and the activity log — both of which read
 * admin-only data, so they are not rendered at all for ordinary accounts.
 */
const CustomDashboard = async ({
  i18n,
  locale,
  navGroups = [],
  payload,
  permissions,
  user,
}: DashboardViewServerProps) => {
  const adminRoute = payload.config.routes.admin;
  const adminUrl = (path: `/${string}`) => formatAdminURL({ adminRoute, path });
  const isAdmin = Boolean(user?.isAdmin);
  const localeCode = locale?.code as 'pt' | 'en' | undefined;

  const [recentDocs, drafts, upcomingEvents] = await Promise.all([
    getRecentDocs(payload, localeCode),
    getDrafts(payload, localeCode),
    getUpcomingEvents(payload, localeCode),
  ]);

  const quickActions: QuickAction[] = QUICK_ACTIONS.filter(
    ({ slug }) => permissions?.collections?.[slug]?.create
  ).map(({ slug, icon, label }) => ({
    href: adminUrl(`/collections/${slug}/create`),
    icon,
    label,
  }));

  const shortcutGroups: ShortcutGroup[] = navGroups.map((group) => ({
    label: group.label,
    entities: group.entities.map((entity) => ({
      href: adminUrl(`/${entity.type}/${entity.slug}`),
      label: getTranslation(entity.label, i18n),
    })),
  }));

  const docHref = ({ collection, id }: { collection: string; id: string }) =>
    adminUrl(`/collections/${collection}/${id}`);

  const now = new Date();
  const displayName = user?.name || user?.email?.split('@')[0] || 'there';

  return (
    <Gutter className='dashboard'>
      <div className='flex flex-col gap-6 py-6'>
        <header className='bg-green flex flex-col gap-4 rounded-xl p-6 text-white shadow-sm lg:flex-row lg:items-end lg:justify-between lg:p-8'>
          <div>
            <p className='text-sm text-white/80'>{todayFormatter.format(now)}</p>
            <h1 className='mt-1 text-3xl font-bold'>
              {greetingFor(now)}, {displayName}
            </h1>
            <p className='mt-2 max-w-2xl text-white/85'>
              Manage HawkStars content in Portuguese and English. Changes are published to both
              versions of the website.
            </p>
          </div>
          <nav className='flex flex-wrap gap-2'>
            {USEFUL_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target='_blank'
                rel='noopener noreferrer'
                className='rounded-md bg-white/15 px-3 py-1.5 text-sm text-white no-underline transition-colors hover:bg-white/25'
              >
                {link.label} ↗
              </a>
            ))}
          </nav>
        </header>

        <QuickActions actions={quickActions} />

        <div className='grid grid-cols-1 gap-6 xl:grid-cols-3'>
          <DocListWidget
            title='Recently Edited'
            icon='🕘'
            docs={recentDocs}
            emptyText='Nothing has been edited yet.'
            hrefFor={docHref}
          />
          <DocListWidget
            title='Not Yet Published'
            icon='📝'
            docs={drafts}
            emptyText='No drafts waiting — everything is live.'
            hrefFor={docHref}
          />
          <UpcomingEventsWidget
            events={upcomingEvents}
            hrefFor={(event) => docHref({ collection: 'hawk_events', id: event.id })}
            allHref={adminUrl('/collections/hawk_events')}
          />
        </div>

        {isAdmin && (
          <div className='grid grid-cols-1 gap-6 xl:grid-cols-3'>
            <div className='flex flex-col gap-6 xl:col-span-2'>
              <Suspense fallback={<></>}>
                <StatsWrapper payload={payload} isAdmin={isAdmin} />
              </Suspense>
            </div>
            <ActivityLogWidget />
          </div>
        )}

        <CollectionShortcuts groups={shortcutGroups} />
      </div>
    </Gutter>
  );
};

export default CustomDashboard;
