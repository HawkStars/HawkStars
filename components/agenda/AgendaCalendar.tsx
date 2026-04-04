'use client';

import React, { useMemo, useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { getImagePayloadUrl } from '@/lib/image';
import type { HawkProject } from '@/payload-types';

// ─── Types ────────────────────────────────────────────────────────────────────

type AgendaEvent = {
  id: string;
  title: string;
  description?: string | null;
  date: string;
  /** ISO string — present for multi-day events */
  endDate?: string | null;
  isDateRange?: boolean;
  type?: string | null;
  slug: string;
  image?: HawkProject['image'];
};

type AgendaCalendarProps = {
  events: AgendaEvent[];
  translations: {
    title: string;
    subtitle: string;
    noEvents: string;
    today: string;
    viewProject: string;
    multiDay: string;
    monthNames: string[];
    dayNames: string[];
  };
  lng: string;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const categoryColors: Record<string, string> = {
  erasmus: 'bg-blue-100 text-blue-800',
  local_event: 'bg-emerald-100 text-emerald-800',
  international_event: 'bg-purple-100 text-purple-800',
  other: 'bg-gray-100 text-gray-800',
};

const categoryDotColors: Record<string, string> = {
  erasmus: 'bg-blue-500',
  local_event: 'bg-emerald-500',
  international_event: 'bg-purple-500',
  other: 'bg-green-500',
};

const categoryLabels: Record<string, Record<string, string>> = {
  en: {
    erasmus: 'Erasmus',
    local_event: 'Local Event',
    international_event: 'International',
    other: 'Other',
  },
  pt: {
    erasmus: 'Erasmus',
    local_event: 'Evento Local',
    international_event: 'Internacional',
    other: 'Outro',
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function toDateKey(iso: string) {
  return iso.split('T')[0];
}

function addDays(dateKey: string, n: number): string {
  const d = new Date(dateKey + 'T12:00:00');
  d.setDate(d.getDate() + n);
  return d.toISOString().split('T')[0];
}

/** Returns every YYYY-MM-DD key between start and end (inclusive). */
function dateKeysInRange(startISO: string, endISO: string): string[] {
  const start = toDateKey(startISO);
  const end = toDateKey(endISO);
  const keys: string[] = [];
  let cursor = start;
  // Safety cap — never more than 365 days
  for (let i = 0; i <= 365; i++) {
    keys.push(cursor);
    if (cursor >= end) break;
    cursor = addDays(cursor, 1);
  }
  return keys;
}

function formatDateRange(
  startISO: string,
  endISO: string | null | undefined,
  locale: string,
): string {
  if (!endISO) {
    return new Date(startISO).toLocaleDateString(locale === 'pt' ? 'pt-PT' : 'en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  const s = new Date(startISO);
  const e = new Date(endISO);
  const loc = locale === 'pt' ? 'pt-PT' : 'en-US';

  if (s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear()) {
    const startDay = s.toLocaleDateString(loc, { day: 'numeric' });
    const endFull = e.toLocaleDateString(loc, { day: 'numeric', month: 'long', year: 'numeric' });
    return `${startDay}–${endFull}`;
  }

  const startFmt = s.toLocaleDateString(loc, { day: 'numeric', month: 'short' });
  const endFmt = e.toLocaleDateString(loc, { day: 'numeric', month: 'short', year: 'numeric' });
  return `${startFmt} – ${endFmt}`;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AgendaCalendar({ events, translations, lng }: AgendaCalendarProps) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  /**
   * Maps YYYY-MM-DD → events that fall on that day.
   * Multi-day events are added to every day they span.
   */
  const eventsByDate = useMemo(() => {
    const map: Record<string, AgendaEvent[]> = {};

    events.forEach((event) => {
      const keys =
        event.isDateRange && event.endDate
          ? dateKeysInRange(event.date, event.endDate)
          : [toDateKey(event.date)];

      keys.forEach((key) => {
        if (!map[key]) map[key] = [];
        // Avoid duplicates when the same event is registered multiple times
        if (!map[key].find((e) => e.id === event.id)) {
          map[key].push(event);
        }
      });
    });

    return map;
  }, [events]);

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setSelectedDate(null);
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setSelectedDate(null);
  };

  const goToToday = () => {
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
    setSelectedDate(null);
  };

  const isToday = (day: number) =>
    day === today.getDate() &&
    currentMonth === today.getMonth() &&
    currentYear === today.getFullYear();

  const getDateKey = (day: number) => {
    const m = String(currentMonth + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${currentYear}-${m}-${d}`;
  };

  const selectedEvents = selectedDate ? (eventsByDate[selectedDate] ?? []) : [];

  // Calendar grid
  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let day = 1; day <= daysInMonth; day++) calendarDays.push(day);

  return (
    <div className='flex flex-col gap-8'>
      {/* Header */}
      <div className='flex flex-col gap-4'>
        <h1 className='text-3xl font-bold uppercase md:text-5xl'>{translations.title}</h1>
        <p className='text-muted-foreground max-w-2xl'>{translations.subtitle}</p>
      </div>

      <div className='flex flex-col gap-8 lg:flex-row'>
        {/* ── Calendar grid ───────────────────────────────────────── */}
        <div className='flex-1 rounded-xl border bg-white p-4 shadow-sm md:p-6'>
          {/* Month navigation */}
          <div className='mb-6 flex items-center justify-between'>
            <Button variant='ghost' size='icon' onClick={prevMonth}>
              <ChevronLeft className='h-5 w-5' />
            </Button>
            <div className='flex items-center gap-3'>
              <h2 className='text-xl font-semibold capitalize'>
                {translations.monthNames[currentMonth]} {currentYear}
              </h2>
              <Button variant='outline' size='sm' onClick={goToToday} className='text-xs'>
                {translations.today}
              </Button>
            </div>
            <Button variant='ghost' size='icon' onClick={nextMonth}>
              <ChevronRight className='h-5 w-5' />
            </Button>
          </div>

          {/* Day headers */}
          <div className='mb-2 grid grid-cols-7 gap-1'>
            {translations.dayNames.map((day) => (
              <div
                key={day}
                className='text-muted-foreground py-2 text-center text-xs font-medium uppercase'
              >
                {day}
              </div>
            ))}
          </div>

          {/* Days */}
          <div className='grid grid-cols-7 gap-1'>
            {calendarDays.map((day, index) => {
              if (day === null) return <div key={`empty-${index}`} className='aspect-square' />;

              const dateKey = getDateKey(day);
              const dayEvents = eventsByDate[dateKey] ?? [];
              const hasEvents = dayEvents.length > 0;
              const isSelected = selectedDate === dateKey;
              const hasRange = dayEvents.some((e) => e.isDateRange);

              return (
                <button
                  key={dateKey}
                  onClick={() => setSelectedDate(isSelected ? null : dateKey)}
                  className={cn(
                    'relative flex aspect-square flex-col items-center justify-start rounded-lg p-1 transition-colors md:p-2',
                    'hover:bg-gray-50',
                    isToday(day) && 'ring-green ring-2',
                    isSelected && 'bg-green/10',
                    hasEvents && 'cursor-pointer',
                  )}
                >
                  <span
                    className={cn(
                      'text-sm font-medium md:text-base',
                      isToday(day) && 'text-green font-bold',
                      !hasEvents && 'text-gray-400',
                    )}
                  >
                    {day}
                  </span>

                  {hasEvents && (
                    <div className='mt-0.5 flex items-center gap-0.5'>
                      {/* Dots for single-day events, bar for range events */}
                      {dayEvents.slice(0, 3).map((evt, i) =>
                        evt.isDateRange ? (
                          <div
                            key={i}
                            className={cn(
                              'h-1.5 w-3 rounded-sm md:h-2 md:w-4',
                              categoryDotColors[evt.type ?? 'other'] ?? 'bg-green-500',
                            )}
                          />
                        ) : (
                          <div
                            key={i}
                            className={cn(
                              'h-1.5 w-1.5 rounded-full md:h-2 md:w-2',
                              categoryDotColors[evt.type ?? 'other'] ?? 'bg-green-500',
                            )}
                          />
                        ),
                      )}
                    </div>
                  )}

                  {/* Small calendar-days icon hint for range events */}
                  {hasRange && !isSelected && (
                    <CalendarDays className='absolute right-0.5 bottom-0.5 h-2.5 w-2.5 text-zinc-300' />
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className='mt-4 flex flex-wrap gap-4 border-t pt-4'>
            {Object.entries(categoryDotColors).map(([key, dotClass]) => (
              <div key={key} className='flex items-center gap-1.5'>
                <div className={cn('h-2.5 w-2.5 rounded-full', dotClass)} />
                <span className='text-xs text-gray-600'>
                  {categoryLabels[lng]?.[key] || categoryLabels['en'][key]}
                </span>
              </div>
            ))}
            {/* Range indicator legend */}
            <div className='flex items-center gap-1.5'>
              <div className='h-2 w-4 rounded-sm bg-gray-400' />
              <span className='text-xs text-gray-600'>{translations.multiDay}</span>
            </div>
          </div>
        </div>

        {/* ── Sidebar ──────────────────────────────────────────────── */}
        <div className='w-full lg:w-96'>
          <div className='sticky top-4 rounded-xl border bg-white p-4 shadow-sm md:p-6'>
            <div className='mb-4 flex items-center gap-2'>
              <Calendar className='text-green h-5 w-5' />
              <h3 className='text-lg font-semibold'>
                {selectedDate
                  ? new Date(selectedDate + 'T12:00:00').toLocaleDateString(
                      lng === 'pt' ? 'pt-PT' : 'en-US',
                      { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' },
                    )
                  : translations.title}
              </h3>
            </div>

            {!selectedDate && (
              <p className='text-muted-foreground text-sm'>{translations.subtitle}</p>
            )}

            {selectedDate && selectedEvents.length === 0 && (
              <p className='text-muted-foreground text-sm'>{translations.noEvents}</p>
            )}

            {selectedEvents.length > 0 && (
              <div className='flex flex-col gap-4'>
                {selectedEvents.map((event) => {
                  const imageInfo = event.image ? getImagePayloadUrl(event.image) : null;
                  const dateLabel = formatDateRange(event.date, event.endDate, lng);

                  return (
                    <a
                      key={event.id}
                      href={`/${lng}/projects/${event.slug}`}
                      className='group block overflow-hidden rounded-lg border transition-shadow hover:shadow-md'
                    >
                      {imageInfo?.url && (
                        <div className='relative h-32 w-full overflow-hidden'>
                          <Image
                            src={imageInfo.url}
                            alt={imageInfo.alt || event.title}
                            fill
                            className='object-cover transition-transform group-hover:scale-105'
                          />
                        </div>
                      )}
                      <div className='p-3'>
                        {/* Type badge + multi-day badge */}
                        <div className='mb-1.5 flex flex-wrap items-center gap-2'>
                          {event.type && (
                            <span
                              className={cn(
                                'rounded-full px-2 py-0.5 text-[10px] font-medium uppercase',
                                categoryColors[event.type] ?? categoryColors.other,
                              )}
                            >
                              {categoryLabels[lng]?.[event.type] ||
                                categoryLabels['en'][event.type] ||
                                event.type}
                            </span>
                          )}
                          {event.isDateRange && (
                            <span className='flex items-center gap-1 rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-600'>
                              <CalendarDays className='h-2.5 w-2.5' />
                              {translations.multiDay}
                            </span>
                          )}
                        </div>

                        <h4 className='font-semibold'>{event.title}</h4>

                        {event.description && (
                          <p className='mt-1 line-clamp-2 text-sm text-gray-600'>
                            {event.description}
                          </p>
                        )}

                        {/* Date range / single date */}
                        <div className='mt-2 flex items-center gap-1 text-xs text-gray-500'>
                          <Calendar className='h-3 w-3 shrink-0' />
                          <span>{dateLabel}</span>
                        </div>

                        <span className='text-green mt-2 inline-block text-xs font-medium'>
                          {translations.viewProject} →
                        </span>
                      </div>
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
