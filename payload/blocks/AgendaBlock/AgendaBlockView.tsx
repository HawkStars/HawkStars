'use client';

import React from 'react';
import { ArrowRight, Calendar, MapPin } from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

export type AgendaEventItem = {
  id: string;
  heading: string;
  subheading?: string | null;
  description?: string | null;
  badge: string | null;
  image: { url: string; alt?: string } | null | undefined;
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
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const typeColors: Record<string, { bg: string; text: string }> = {
  erasmus: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300' },
  local_event: {
    bg: 'bg-green-100 dark:bg-green-900/30',
    text: 'text-green-700 dark:text-green-300',
  },
  international_event: {
    bg: 'bg-purple-100 dark:bg-purple-900/30',
    text: 'text-purple-700 dark:text-purple-300',
  },
  other: { bg: 'bg-zinc-100 dark:bg-zinc-700', text: 'text-zinc-600 dark:text-zinc-400' },
};

function fmtDate(iso: string, opts?: Intl.DateTimeFormatOptions) {
  return new Date(iso).toLocaleDateString('pt-PT', {
    day: 'numeric',
    month: 'long',
    ...opts,
  });
}

function formatEventDate(date: string | null, endDate?: string | null, isRange?: boolean): string {
  if (!date) return '';

  if (!isRange || !endDate) {
    return fmtDate(date, { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' });
  }

  const s = new Date(date);
  const e = new Date(endDate);

  if (s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear()) {
    // Same month: "3–5 de Maio de 2025"
    const startDay = s.toLocaleDateString('pt-PT', { day: 'numeric' });
    const endFull = fmtDate(endDate, { day: 'numeric', month: 'long', year: 'numeric' });
    return `${startDay}–${endFull}`;
  }

  // Cross-month: "30 de Out – 2 de Nov de 2025"
  return `${fmtDate(date)} – ${fmtDate(endDate, { day: 'numeric', month: 'long', year: 'numeric' })}`;
}

// ─── Sub-renderers ────────────────────────────────────────────────────────────

function BadgeChip({ badge }: { badge: string }) {
  const colors = typeColors[badge] ?? typeColors.other;
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ${colors.bg} ${colors.text}`}
    >
      {badge.replace('_', ' ')}
    </span>
  );
}

// ─── List layout ─────────────────────────────────────────────────────────────

function ListItem({
  event,
  linkLabel,
}: {
  event: AgendaEventItem;
  linkLabel: string;
}) {
  const dateStr = formatEventDate(event.date, event.endDate, event.isDateRange);

  return (
    <div className='flex gap-5 border-b border-zinc-100 py-6 last:border-0 dark:border-zinc-800'>
      {/* Date column */}
      <div className='hidden w-28 shrink-0 flex-col items-center justify-start pt-1 sm:flex'>
        {event.date && (
          <>
            <span className='text-3xl font-bold tabular-nums text-zinc-800 dark:text-zinc-100'>
              {new Date(event.date).getDate()}
            </span>
            <span className='text-sm font-medium uppercase text-zinc-500 dark:text-zinc-400'>
              {new Date(event.date).toLocaleDateString('pt-PT', { month: 'short' })}
            </span>
            <span className='text-xs text-zinc-400 dark:text-zinc-500'>
              {new Date(event.date).getFullYear()}
            </span>
            {event.isDateRange && event.endDate && (
              <span className='mt-1 text-xs text-zinc-400 dark:text-zinc-500'>
                →{' '}
                {new Date(event.endDate).toLocaleDateString('pt-PT', {
                  day: 'numeric',
                  month: 'short',
                })}
              </span>
            )}
          </>
        )}
      </div>

      {/* Content */}
      <div className='flex flex-1 flex-col gap-1'>
        <div className='flex flex-wrap items-center gap-2'>
          {event.badge && <BadgeChip badge={event.badge} />}
          {/* Mobile date */}
          <span className='flex items-center gap-1 text-xs text-zinc-500 sm:hidden dark:text-zinc-400'>
            <Calendar className='h-3 w-3' />
            {dateStr}
          </span>
        </div>

        <h3 className='text-lg font-semibold text-zinc-900 dark:text-zinc-100'>{event.heading}</h3>

        {event.subheading && (
          <p className='text-sm text-zinc-600 dark:text-zinc-400'>{event.subheading}</p>
        )}

        {event.description && (
          <p className='mt-1 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400'>
            {event.description}
          </p>
        )}

        <a
          href={event.href}
          className='mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-green-600 transition-colors hover:text-green-700 hover:underline dark:text-green-400 dark:hover:text-green-300'
        >
          {linkLabel}
          <ArrowRight className='h-3.5 w-3.5' />
        </a>
      </div>

      {/* Image */}
      {event.image?.url && (
        <div className='relative hidden h-24 w-32 shrink-0 overflow-hidden rounded-lg md:block'>
          <img
            src={event.image.url}
            alt={event.image.alt || event.heading}
            className='h-full w-full object-cover'
          />
        </div>
      )}
    </div>
  );
}

// ─── Compact layout ───────────────────────────────────────────────────────────

function CompactItem({
  event,
  linkLabel,
}: {
  event: AgendaEventItem;
  linkLabel: string;
}) {
  const dateStr = formatEventDate(event.date, event.endDate, event.isDateRange);

  return (
    <a
      href={event.href}
      className='group flex items-center gap-4 rounded-lg border border-zinc-100 px-4 py-3 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800/50'
    >
      <Calendar className='h-4 w-4 shrink-0 text-zinc-400' />
      <span className='w-36 shrink-0 text-sm font-mono text-zinc-500 dark:text-zinc-400'>
        {dateStr}
      </span>
      <span className='flex-1 font-medium text-zinc-900 group-hover:text-green-600 dark:text-zinc-100 dark:group-hover:text-green-400'>
        {event.heading}
      </span>
      {event.badge && <BadgeChip badge={event.badge} />}
      <ArrowRight className='h-4 w-4 shrink-0 text-zinc-400 transition-transform group-hover:translate-x-0.5' />
    </a>
  );
}

// ─── Cards layout ─────────────────────────────────────────────────────────────

function CardItem({
  event,
  linkLabel,
}: {
  event: AgendaEventItem;
  linkLabel: string;
}) {
  const dateStr = formatEventDate(event.date, event.endDate, event.isDateRange);

  return (
    <div className='group flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-800'>
      {/* Image */}
      <div className='relative h-44 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-700'>
        {event.image?.url ? (
          <img
            src={event.image.url}
            alt={event.image.alt || event.heading}
            className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-105'
          />
        ) : (
          <div className='flex h-full w-full items-center justify-center'>
            <Calendar className='h-12 w-12 text-zinc-300 dark:text-zinc-600' />
          </div>
        )}
        {event.badge && (
          <div className='absolute top-3 left-3'>
            <BadgeChip badge={event.badge} />
          </div>
        )}
      </div>

      {/* Content */}
      <div className='flex flex-1 flex-col gap-2 p-4'>
        <div className='flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400'>
          <Calendar className='h-3.5 w-3.5' />
          <span>{dateStr}</span>
        </div>

        <h3 className='font-semibold text-zinc-900 dark:text-zinc-100'>{event.heading}</h3>

        {event.subheading && (
          <p className='text-sm text-zinc-500 dark:text-zinc-400'>{event.subheading}</p>
        )}

        {event.description && (
          <p className='line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400'>
            {event.description}
          </p>
        )}

        <a
          href={event.href}
          className='mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-medium text-green-600 transition-colors hover:text-green-700 hover:underline dark:text-green-400 dark:hover:text-green-300'
        >
          {linkLabel}
          <ArrowRight className='h-3.5 w-3.5' />
        </a>
      </div>
    </div>
  );
}

// ─── Main view ────────────────────────────────────────────────────────────────

export function AgendaBlockView({
  title,
  subtitle,
  layout = 'list',
  linkLabel = 'Ver mais',
  sectionId,
  events,
  loading = false,
}: AgendaBlockViewProps) {
  const label = linkLabel || 'Ver mais';

  return (
    <section id={sectionId ?? undefined} className='w-full py-12'>
      <div className='mx-auto max-w-4xl px-4'>
        {/* Header */}
        {(title || subtitle) && (
          <div className='mb-8'>
            {title && (
              <h2 className='mb-2 text-3xl font-bold text-zinc-900 dark:text-zinc-100'>{title}</h2>
            )}
            {subtitle && (
              <p className='text-lg text-zinc-600 dark:text-zinc-400'>{subtitle}</p>
            )}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className='flex items-center gap-3 py-8 text-zinc-500'>
            <div className='h-5 w-5 animate-spin rounded-full border-2 border-zinc-300 border-t-green-500' />
            <span className='text-sm'>A carregar eventos…</span>
          </div>
        )}

        {/* Empty state */}
        {!loading && events.length === 0 && (
          <div className='flex flex-col items-center gap-3 rounded-xl bg-zinc-50 py-16 text-center dark:bg-zinc-800/50'>
            <Calendar className='h-10 w-10 text-zinc-300 dark:text-zinc-600' />
            <p className='text-zinc-500 dark:text-zinc-400'>Sem eventos próximos.</p>
          </div>
        )}

        {/* List */}
        {!loading && events.length > 0 && layout === 'list' && (
          <div>
            {events.map((ev) => (
              <ListItem key={ev.id} event={ev} linkLabel={label} />
            ))}
          </div>
        )}

        {/* Compact */}
        {!loading && events.length > 0 && layout === 'compact' && (
          <div className='flex flex-col gap-2'>
            {events.map((ev) => (
              <CompactItem key={ev.id} event={ev} linkLabel={label} />
            ))}
          </div>
        )}

        {/* Cards */}
        {!loading && events.length > 0 && layout === 'cards' && (
          <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
            {events.map((ev) => (
              <CardItem key={ev.id} event={ev} linkLabel={label} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
