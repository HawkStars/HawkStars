'use client';

import React, { useMemo, useState } from 'react';
import { Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { getImagePayloadUrl } from '@/lib/image';
import type { HawkProject } from '@/payload-types';

type AgendaEvent = {
  id: string;
  title: string;
  description?: string | null;
  date: string;
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
    monthNames: string[];
    dayNames: string[];
  };
  lng: string;
};

const categoryColors: Record<string, string> = {
  erasmus: 'bg-blue-100 text-blue-800',
  local_event: 'bg-emerald-100 text-emerald-800',
  international_event: 'bg-purple-100 text-purple-800',
  other: 'bg-gray-100 text-gray-800',
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

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

export default function AgendaCalendar({ events, translations, lng }: AgendaCalendarProps) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const eventsByDate = useMemo(() => {
    const map: Record<string, AgendaEvent[]> = {};
    events.forEach((event) => {
      const dateKey = event.date.split('T')[0];
      if (!map[dateKey]) map[dateKey] = [];
      map[dateKey].push(event);
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

  const isToday = (day: number) => {
    return (
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    );
  };

  const getDateKey = (day: number) => {
    const m = String(currentMonth + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${currentYear}-${m}-${d}`;
  };

  const selectedEvents = selectedDate ? eventsByDate[selectedDate] || [] : [];

  // Build calendar grid
  const calendarDays: (number | null)[] = [];
  // Days from previous month to fill the first week
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  return (
    <div className='flex flex-col gap-8'>
      {/* Header */}
      <div className='flex flex-col gap-4'>
        <h1 className='text-3xl font-bold uppercase md:text-5xl'>{translations.title}</h1>
        <p className='text-muted-foreground max-w-2xl'>{translations.subtitle}</p>
      </div>

      <div className='flex flex-col gap-8 lg:flex-row'>
        {/* Calendar Grid */}
        <div className='flex-1 rounded-xl border bg-white p-4 shadow-sm md:p-6'>
          {/* Month Navigation */}
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

          {/* Day Headers */}
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

          {/* Calendar Days */}
          <div className='grid grid-cols-7 gap-1'>
            {calendarDays.map((day, index) => {
              if (day === null) {
                return <div key={`empty-${index}`} className='aspect-square' />;
              }

              const dateKey = getDateKey(day);
              const dayEvents = eventsByDate[dateKey] || [];
              const hasEvents = dayEvents.length > 0;
              const isSelected = selectedDate === dateKey;

              return (
                <button
                  key={dateKey}
                  onClick={() => setSelectedDate(isSelected ? null : dateKey)}
                  className={cn(
                    'relative flex aspect-square flex-col items-center justify-start rounded-lg p-1 transition-colors md:p-2',
                    'hover:bg-gray-50',
                    isToday(day) && 'ring-green ring-2',
                    isSelected && 'bg-green/10',
                    hasEvents && 'cursor-pointer'
                  )}
                >
                  <span
                    className={cn(
                      'text-sm font-medium md:text-base',
                      isToday(day) && 'text-green font-bold',
                      !hasEvents && 'text-gray-400'
                    )}
                  >
                    {day}
                  </span>
                  {hasEvents && (
                    <div className='mt-0.5 flex gap-0.5'>
                      {dayEvents.slice(0, 3).map((evt, i) => (
                        <div
                          key={i}
                          className={cn(
                            'h-1.5 w-1.5 rounded-full md:h-2 md:w-2',
                            evt.type === 'erasmus'
                              ? 'bg-blue-500'
                              : evt.type === 'local_event'
                                ? 'bg-emerald-500'
                                : evt.type === 'international_event'
                                  ? 'bg-purple-500'
                                  : 'bg-green'
                          )}
                        />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className='mt-4 flex flex-wrap gap-4 border-t pt-4'>
            {Object.entries(categoryColors).map(([key]) => (
              <div key={key} className='flex items-center gap-1.5'>
                <div
                  className={cn(
                    'h-2.5 w-2.5 rounded-full',
                    key === 'erasmus'
                      ? 'bg-blue-500'
                      : key === 'local_event'
                        ? 'bg-emerald-500'
                        : key === 'international_event'
                          ? 'bg-purple-500'
                          : 'bg-green'
                  )}
                />
                <span className='text-xs text-gray-600'>
                  {categoryLabels[lng]?.[key] || categoryLabels['en'][key]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Day Events Sidebar */}
        <div className='w-full lg:w-96'>
          <div className='sticky top-4 rounded-xl border bg-white p-4 shadow-sm md:p-6'>
            <div className='mb-4 flex items-center gap-2'>
              <Calendar className='text-green h-5 w-5' />
              <h3 className='text-lg font-semibold'>
                {selectedDate
                  ? new Date(selectedDate + 'T12:00:00').toLocaleDateString(
                      lng === 'pt' ? 'pt-PT' : 'en-US',
                      {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      }
                    )
                  : translations.title}
              </h3>
            </div>

            {!selectedDate && (
              <p className='text-muted-foreground text-sm'>
                {translations.noEvents.replace('{action}', '')}
              </p>
            )}

            {selectedDate && selectedEvents.length === 0 && (
              <p className='text-muted-foreground text-sm'>{translations.noEvents}</p>
            )}

            {selectedEvents.length > 0 && (
              <div className='flex flex-col gap-4'>
                {selectedEvents.map((event) => {
                  const imageInfo = event.image ? getImagePayloadUrl(event.image) : null;
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
                        <div className='mb-1 flex items-center gap-2'>
                          <h4 className='font-semibold'>{event.title}</h4>
                          {event.type && (
                            <span
                              className={cn(
                                'rounded-full px-2 py-0.5 text-[10px] font-medium uppercase',
                                categoryColors[event.type] || categoryColors.other
                              )}
                            >
                              {categoryLabels[lng]?.[event.type] ||
                                categoryLabels['en'][event.type] ||
                                event.type}
                            </span>
                          )}
                        </div>
                        {event.description && (
                          <p className='line-clamp-2 text-sm text-gray-600'>{event.description}</p>
                        )}
                        <div className='mt-2 flex items-center gap-1 text-xs text-gray-500'>
                          <Clock className='h-3 w-3' />
                          <span>
                            {new Date(event.date).toLocaleTimeString(
                              lng === 'pt' ? 'pt-PT' : 'en-US',
                              {
                                hour: '2-digit',
                                minute: '2-digit',
                              }
                            )}
                          </span>
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
