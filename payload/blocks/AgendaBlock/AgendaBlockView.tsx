'use client';

import Link from 'next/link';
import { LuArrowRight, LuCalendar } from 'react-icons/lu';
import { HawkStarsSection } from '@/components/layout';
import { ImageMedia } from '@/payload/components/Media';
import { CustomImageProps } from '@/lib/image';
import { cn } from '@/lib/utils';
import { Language } from '@/i18n/settings';
import { useTranslation } from '@/i18n/client';
import { formatDate, formatDateRange } from '@/utils/date';
import { transformUrl } from '@/utils/paths';

// ─── Types ───────────────────────────────────────────────────────────────────

export type AgendaEventItem = {
  id: string;
  heading: string;
  subheading?: string | null;
  description?: string | null;
  /** Type slug: an event `type_event`, 'erasmus', or 'project'. Translated for display. */
  badge: string | null;
  image?: Pick<CustomImageProps, 'url' | 'alt'> | null;
  /** Site path without the locale prefix, e.g. `/events/slug`. */
  href: string;
  /** ISO date string — always the start/only date */
  date: string | null;
  /** ISO date string — set only for multi-day events */
  endDate?: string | null;
  isDateRange: boolean;
};

export type AgendaBlockViewProps = {
  title?: string | null;
  subtitle?: string | null;
  layout?: 'list' | 'compact' | 'cards' | null;
  linkLabel?: string | null;
  sectionId?: string | null;
  events: AgendaEventItem[];
  loading?: boolean;
  lng: Language;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

// Accents keep their one job: ink marks international / Europe, terracotta marks
// time-bound events, and green marks the NGO's own projects.
const badgeColors: Record<string, string> = {
  erasmus: 'bg-ink-light text-ink',
  international_event: 'bg-ink-light text-ink',
  local_event: 'bg-terracotta-light text-terracotta-dark',
  project: 'bg-bege-dark text-green-dark',
  other: 'bg-bege-dark text-black/70',
};

// Dates go through utils/date: page locale (these were once pinned to 'pt-PT') and the
// site time zone, so server and browser render the same day.
function formatEventDate(
  date: string | null,
  lng: Language,
  endDate?: string | null,
  isRange?: boolean
): string {
  if (!date) return '';
  if (isRange && endDate) return formatDateRange(date, endDate, lng);
  return formatDate(date, lng, {
    weekday: 'short',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// ─── Sub-renderers ────────────────────────────────────────────────────────────

function BadgeChip({ badge, lng }: { badge: string; lng: Language }) {
  const { t } = useTranslation(lng, 'common');
  return (
    <span
      className={cn(
        'inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide uppercase',
        badgeColors[badge] ?? badgeColors.other
      )}
    >
      {t(`blocks.eventTypes.${badge}`, { defaultValue: t('blocks.eventTypes.other') })}
    </span>
  );
}

function EventDate({
  event,
  lng,
  className,
}: {
  event: AgendaEventItem;
  lng: Language;
  className?: string;
}) {
  const dateStr = formatEventDate(event.date, lng, event.endDate, event.isDateRange);
  if (!dateStr) return null;
  return (
    <span
      className={cn(
        'text-terracotta-dark flex items-center gap-1.5 text-sm font-medium',
        className
      )}
    >
      <LuCalendar aria-hidden className='size-3.5 shrink-0' />
      <time dateTime={event.date ?? undefined}>{dateStr}</time>
    </span>
  );
}

// ─── List layout ─────────────────────────────────────────────────────────────

function ListItem({
  event,
  linkLabel,
  lng,
}: {
  event: AgendaEventItem;
  linkLabel: string;
  lng: Language;
}) {
  return (
    <li className='border-bege-dark flex gap-5 border-b py-6 last:border-0 lg:gap-8'>
      {/* Date column — a calendar-leaf block: big day, small month and year */}
      <div className='hidden w-20 shrink-0 flex-col items-center pt-1 text-center sm:flex'>
        {event.date && (
          <>
            <span className='font-display text-terracotta-dark text-4xl leading-none font-semibold tabular-nums'>
              {formatDate(event.date, lng, { day: 'numeric' })}
            </span>
            <span className='text-eyebrow mt-1 text-black/70'>
              {formatDate(event.date, lng, { month: 'short' })}
            </span>
            <span className='text-xs text-black/60'>
              {formatDate(event.date, lng, { year: 'numeric' })}
            </span>
            {event.isDateRange && event.endDate && (
              <span className='mt-1 text-xs text-black/60'>
                → {formatDate(event.endDate, lng, { day: 'numeric', month: 'short' })}
              </span>
            )}
          </>
        )}
      </div>

      {/* Content */}
      <div className='flex min-w-0 flex-1 flex-col gap-1.5'>
        <div className='flex flex-wrap items-center gap-2'>
          {event.badge && <BadgeChip badge={event.badge} lng={lng} />}
          <EventDate event={event} lng={lng} className='sm:hidden' />
        </div>

        <h3 className='text-h3_semibold'>{event.heading}</h3>

        {event.subheading && <p className='text-sm text-black/70'>{event.subheading}</p>}

        {event.description && (
          <p className='mt-1 line-clamp-2 max-w-prose text-sm leading-relaxed text-black/70'>
            {event.description}
          </p>
        )}

        <Link
          href={transformUrl(lng, event.href)}
          className='text-green hover:text-green-dark mt-1 inline-flex min-h-11 items-center gap-1.5 self-start text-sm font-medium underline-offset-4 hover:underline'
        >
          {linkLabel}
          <LuArrowRight aria-hidden className='size-3.5' />
        </Link>
      </div>

      {event.image?.url && (
        <div className='bg-bege-dark relative hidden h-28 w-40 shrink-0 overflow-hidden rounded-lg md:block'>
          <ImageMedia
            src={event.image.url}
            alt={event.image.alt || ''}
            fill
            sizes='160px'
            className='object-cover'
          />
        </div>
      )}
    </li>
  );
}

// ─── Compact layout ───────────────────────────────────────────────────────────

function CompactItem({ event, lng }: { event: AgendaEventItem; lng: Language }) {
  const dateStr = formatEventDate(event.date, lng, event.endDate, event.isDateRange);

  return (
    <li>
      <Link
        href={transformUrl(lng, event.href)}
        className='card-sm card-hover group focus-visible:ring-green flex min-h-14 items-center gap-4 px-4 py-3 focus-visible:ring-2 focus-visible:outline-hidden'
      >
        {/* Stacks on a phone, one row from sm up */}
        <div className='flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:gap-4'>
          {dateStr && (
            <time
              dateTime={event.date ?? undefined}
              className='text-terracotta-dark shrink-0 text-sm font-medium tabular-nums sm:w-56'
            >
              {dateStr}
            </time>
          )}
          <span className='group-hover:text-green min-w-0 flex-1 font-medium transition-colors'>
            {event.heading}
          </span>
          {event.badge && (
            <span className='shrink-0'>
              <BadgeChip badge={event.badge} lng={lng} />
            </span>
          )}
        </div>
        <LuArrowRight
          aria-hidden
          className='group-hover:text-green size-4 shrink-0 text-black/40 transition-transform group-hover:translate-x-0.5'
        />
      </Link>
    </li>
  );
}

// ─── Cards layout ─────────────────────────────────────────────────────────────

function CardItem({
  event,
  linkLabel,
  lng,
}: {
  event: AgendaEventItem;
  linkLabel: string;
  lng: Language;
}) {
  return (
    <li className='card card-hover group focus-within:ring-green relative flex flex-col overflow-hidden focus-within:ring-2'>
      <div className='bg-bege-dark relative aspect-video w-full overflow-hidden'>
        {event.image?.url ? (
          <ImageMedia
            src={event.image.url}
            alt={event.image.alt || ''}
            fill
            sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
            className='object-cover transition-transform duration-500 group-hover:scale-105'
          />
        ) : (
          <div className='flex h-full w-full items-center justify-center'>
            <LuCalendar aria-hidden className='text-green/30 size-12' />
          </div>
        )}
        {event.badge && (
          <div className='absolute top-3 left-3'>
            <BadgeChip badge={event.badge} lng={lng} />
          </div>
        )}
      </div>

      <div className='flex flex-1 flex-col gap-2 p-5'>
        <EventDate event={event} lng={lng} />

        <h3 className='text-h3_semibold group-hover:text-green transition-colors'>
          {event.heading}
        </h3>

        {event.subheading && <p className='text-sm text-black/70'>{event.subheading}</p>}

        {event.description && (
          <p className='line-clamp-2 text-sm leading-relaxed text-black/70'>{event.description}</p>
        )}

        {/* The link's ::after covers the whole card, so the card is one big tap target. */}
        <Link
          href={transformUrl(lng, event.href)}
          className='text-green mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-medium after:absolute after:inset-0 focus-visible:outline-hidden'
        >
          {linkLabel}
          <LuArrowRight aria-hidden className='size-3.5' />
        </Link>
      </div>
    </li>
  );
}

// ─── Main view ────────────────────────────────────────────────────────────────

export function AgendaBlockView({
  title,
  subtitle,
  layout = 'list',
  linkLabel,
  sectionId,
  events,
  loading = false,
  lng,
}: AgendaBlockViewProps) {
  const { t } = useTranslation(lng, 'common');
  // Was hardcoded to the Portuguese 'Ver mais', which shipped verbatim to /en.
  const label = linkLabel || t('see_more');

  // Nothing scheduled: leave the section out rather than show a large empty box
  // on the page (the homepage most of all). It reappears as soon as an event is added.
  if (!loading && events.length === 0) return null;

  const hasEvents = !loading && events.length > 0;
  // The CMS sends `null` when the editor never picked a layout; a default parameter
  // only covers `undefined`, so the block used to render nothing at all.
  const view = layout ?? 'list';

  return (
    <HawkStarsSection
      spacing='default'
      padding='none'
      cap='none'
      container
      id={sectionId ?? undefined}
      data-blockid='agenda'
    >
      {(title || subtitle) && (
        <header className='section-header text-center'>
          {title && <h2 className='text-h2_semibold'>{title}</h2>}
          {subtitle && <p className='text-h2_light mt-4 text-black/70'>{subtitle}</p>}
        </header>
      )}

      {loading && (
        <div role='status' className='flex items-center justify-center gap-3 py-12 text-black/60'>
          <span
            aria-hidden
            className='border-bege-dark border-t-green size-5 animate-spin rounded-full border-2'
          />
          <span className='text-sm'>{t('agenda.loading')}</span>
        </div>
      )}

      {hasEvents && view === 'list' && (
        <ul className='card mx-auto max-w-4xl px-5 lg:px-8'>
          {events.map((ev) => (
            <ListItem key={ev.id} event={ev} linkLabel={label} lng={lng} />
          ))}
        </ul>
      )}

      {hasEvents && view === 'compact' && (
        <ul className='mx-auto flex max-w-4xl flex-col gap-2'>
          {events.map((ev) => (
            <CompactItem key={ev.id} event={ev} lng={lng} />
          ))}
        </ul>
      )}

      {hasEvents && view === 'cards' && (
        <ul className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8'>
          {events.map((ev) => (
            <CardItem key={ev.id} event={ev} linkLabel={label} lng={lng} />
          ))}
        </ul>
      )}
    </HawkStarsSection>
  );
}
