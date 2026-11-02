import type { DashboardViewServerProps } from '@payloadcms/next/views';
import { getTranslation } from '@payloadcms/translations';
import { Gutter } from '@payloadcms/ui';
import { formatAdminURL } from '@payloadcms/ui/shared';
import { Suspense } from 'react';
import { ActivityLogWidget } from '../DashboardStats/ActivityLogWidget';
import StatsWrapper from '../DashboardStats/stats/StatsWrapper';
import { toDashboardLang } from '../dashboardLang';
import { DASHBOARD_COPY } from './copy';
import { getDrafts, getRecentDocs, getUpcomingEvents } from './queries';
import {
  CollectionShortcuts,
  DocListWidget,
  QuickActions,
  type QuickAction,
  type ShortcutGroup,
  UpcomingEventsWidget,
} from './sections';

const QUICK_ACTIONS = [
  { slug: 'news', icon: '📰' },
  { slug: 'hawk_projects', icon: '🚀' },
  { slug: 'hawk_events', icon: '📅' },
  { slug: 'pages', icon: '📄' },
  { slug: 'media', icon: '🖼️' },
] as const;

const TUTORIAL_URL = 'https://www.youtube.com/watch?v=0qDAn7jQOyc';
const COMPONENTS_URL = 'https://6936ae02571a354f4f7c288f-lepszhgmbl.chromatic.com/';

const lisbonHour = (date: Date) =>
  Number(
    new Intl.DateTimeFormat('en-GB', { hour: 'numeric', timeZone: 'Europe/Lisbon' }).format(date)
  );

const greetingFor = (
  date: Date,
  greeting: { morning: string; afternoon: string; evening: string }
) => {
  const hour = lisbonHour(date);
  if (hour < 12) return greeting.morning;
  if (hour < 19) return greeting.afternoon;
  return greeting.evening;
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
  // `user` can also be an MCP API key, which is neither a person nor an admin.
  const account = user?.collection === 'users' ? user : undefined;
  const isAdmin = Boolean(account?.isAdmin);
  const localeCode = locale?.code as 'pt' | 'en' | undefined;
  // Admin UI language (Account → Language), not the content locale above.
  const lang = toDashboardLang(i18n.language);
  const copy = DASHBOARD_COPY[lang];

  const [recentDocs, drafts, upcomingEvents] = await Promise.all([
    getRecentDocs(payload, localeCode),
    getDrafts(payload, localeCode),
    getUpcomingEvents(payload, localeCode),
  ]);

  const quickActions: QuickAction[] = QUICK_ACTIONS.filter(
    ({ slug }) => permissions?.collections?.[slug]?.create
  ).map(({ slug, icon }) => ({
    href: adminUrl(`/collections/${slug}/create`),
    icon,
    label: copy.quickActions[slug],
  }));

  const usefulLinks = [
    { href: TUTORIAL_URL, label: 'Tutorial' },
    { href: COMPONENTS_URL, label: copy.existingComponents },
  ];

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
  const today = new Intl.DateTimeFormat(copy.intlLocale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/Lisbon',
  }).format(now);
  const displayName = account?.name || account?.email?.split('@')[0];

  return (
    <Gutter className='dashboard'>
      <div className='flex flex-col gap-6 py-6'>
        <header className='bg-green flex flex-col gap-4 rounded-xl p-6 text-white shadow-sm lg:flex-row lg:items-end lg:justify-between lg:p-8'>
          <div>
            <p className='text-sm text-white/80 first-letter:uppercase'>{today}</p>
            <h1 className='mt-1 text-3xl font-bold'>
              {greetingFor(now, copy.greeting)}
              {displayName && `, ${displayName}`}
            </h1>
            <p className='mt-2 max-w-2xl text-white/85'>{copy.intro}</p>
          </div>
          <nav className='flex flex-wrap gap-2'>
            {usefulLinks.map((link) => (
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
            title={copy.recentlyEdited.title}
            icon='🕘'
            docs={recentDocs}
            emptyText={copy.recentlyEdited.empty}
            lang={lang}
            hrefFor={docHref}
          />
          <DocListWidget
            title={copy.notYetPublished.title}
            icon='📝'
            docs={drafts}
            emptyText={copy.notYetPublished.empty}
            lang={lang}
            hrefFor={docHref}
          />
          <UpcomingEventsWidget
            events={upcomingEvents}
            lang={lang}
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

        <CollectionShortcuts groups={shortcutGroups} title={copy.content} />
      </div>
    </Gutter>
  );
};

export default CustomDashboard;
