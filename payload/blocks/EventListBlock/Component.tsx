import React from 'react';
import Image from 'next/image';
import { Calendar, MapPin, Users, Clock, Tag } from 'lucide-react';
import type { EventListBlock as EventListBlockProps, Media } from '@/payload-types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export const EventListBlock: React.FC<EventListBlockProps> = ({
  title,
  subtitle,
  events = [],
  layout = 'list',
  showPastEvents = false,
}) => {
  const categoryColors = {
    workshop: 'bg-bege-light text-black',
    meeting: 'bg-bege-dark text-black',
    fundraiser: 'bg-bege-light text-green',
    social: 'bg-bege-dark text-green',
    community: 'bg-bege-light text-black',
    youth: 'bg-bege-dark text-black',
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredEvents = showPastEvents
    ? events
    : events?.filter((event) => new Date(event.date) >= new Date());

  if (!filteredEvents || filteredEvents.length === 0) {
    return null;
  }

  return (
    <section className='py-12 lg:py-20'>
      <div className='container mx-auto'>
        {/* Header */}
        {(title || subtitle) && (
          <div className='mb-12 text-center'>
            {title && <h2 className='mb-4 text-3xl font-bold lg:text-4xl'>{title}</h2>}
            {subtitle && <p className='mx-auto max-w-2xl text-lg text-gray-600'>{subtitle}</p>}
          </div>
        )}

        {/* List Layout */}
        {layout === 'list' && (
          <div className='space-y-6'>
            {filteredEvents.map((event, index) => (
              <div
                key={index}
                className={cn(
                  'card-sm card-hover overflow-hidden rounded-xl border bg-white',
                  event.isFeatured && 'border-green ring-green ring-2'
                )}
              >
                <div className='flex flex-col gap-6 p-6 md:flex-row'>
                  {/* Date Badge */}
                  <div className='bg-green flex shrink-0 flex-col items-center justify-center rounded-lg p-4 text-white md:w-24'>
                    <div className='text-3xl font-bold'>{new Date(event.date).getDate()}</div>
                    <div className='text-sm uppercase'>
                      {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                    </div>
                  </div>

                  {/* Event Details */}
                  <div className='flex-1'>
                    <div className='mb-2 flex flex-wrap items-center gap-3'>
                      <h3 className='text-2xl font-semibold'>{event.title}</h3>
                      {event.category && (
                        <span
                          className={cn(
                            'rounded-full px-3 py-1 text-xs font-semibold uppercase',
                            categoryColors[event.category as keyof typeof categoryColors]
                          )}
                        >
                          {event.category}
                        </span>
                      )}
                      {event.isFeatured && (
                        <span className='bg-bege-dark rounded-full px-3 py-1 text-xs font-semibold text-black'>
                          Featured
                        </span>
                      )}
                    </div>

                    <div className='mb-3 flex flex-wrap gap-4 text-sm text-gray-600'>
                      <div className='flex items-center gap-2'>
                        <Clock className='h-4 w-4' />
                        {formatTime(event.date)}
                      </div>
                      {event.location && (
                        <div className='flex items-center gap-2'>
                          <MapPin className='h-4 w-4' />
                          {event.location}
                        </div>
                      )}
                      {event.spotsRemaining !== undefined && event.maxParticipants && (
                        <div className='flex items-center gap-2'>
                          <Users className='h-4 w-4' />
                          {event.spotsRemaining} of {event.maxParticipants} spots left
                        </div>
                      )}
                    </div>

                    {event.description && <p className='mb-4 text-gray-700'>{event.description}</p>}

                    {event.registrationLink && (
                      <Button size='sm' asChild>
                        <a href={event.registrationLink}>Register</a>
                      </Button>
                    )}
                  </div>

                  {/* Event Image */}
                  {event.image && typeof event.image !== 'string' && (
                    <div className='relative h-40 w-full shrink-0 overflow-hidden rounded-lg md:h-auto md:w-48'>
                      <Image
                        src={(event.image as Media).url || ''}
                        alt={event.title}
                        fill
                        className='object-cover'
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Grid Layout */}
        {layout === 'grid' && (
          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {filteredEvents.map((event, index) => (
              <div
                key={index}
                className='card-sm card-hover-lg overflow-hidden rounded-xl border border-gray-200 bg-white'
              >
                {event.image && typeof event.image !== 'string' && (
                  <div className='relative h-48 w-full'>
                    <Image
                      src={(event.image as Media).url || ''}
                      alt={event.title}
                      fill
                      className='object-cover'
                    />
                  </div>
                )}
                <div className='p-6'>
                  {event.category && (
                    <span
                      className={cn(
                        'mb-3 inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase',
                        categoryColors[event.category as keyof typeof categoryColors]
                      )}
                    >
                      {event.category}
                    </span>
                  )}
                  <h3 className='mb-2 text-xl font-semibold'>{event.title}</h3>
                  <div className='mb-3 space-y-2 text-sm text-gray-600'>
                    <div className='flex items-center gap-2'>
                      <Calendar className='h-4 w-4' />
                      {formatDate(event.date)} at {formatTime(event.date)}
                    </div>
                    {event.location && (
                      <div className='flex items-center gap-2'>
                        <MapPin className='h-4 w-4' />
                        {event.location}
                      </div>
                    )}
                  </div>
                  {event.description && (
                    <p className='mb-4 line-clamp-2 text-gray-700'>{event.description}</p>
                  )}
                  {event.registrationLink && (
                    <Button size='sm' className='w-full' asChild>
                      <a href={event.registrationLink}>Register</a>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Timeline Layout */}
        {layout === 'timeline' && (
          <div className='relative'>
            <div className='absolute top-0 bottom-0 left-8 w-0.5 bg-gray-300' />
            <div className='space-y-8'>
              {filteredEvents.map((event, index) => (
                <div key={index} className='relative flex gap-6'>
                  <div className='bg-green card-md z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-4 border-white text-white'>
                    <Calendar className='h-6 w-6' />
                  </div>
                  <div className='card-sm flex-1 rounded-xl border border-gray-200 bg-white p-6'>
                    <div className='mb-2 flex items-center gap-3'>
                      <h3 className='text-xl font-semibold'>{event.title}</h3>
                      {event.category && (
                        <span
                          className={cn(
                            'rounded-full px-3 py-1 text-xs font-semibold uppercase',
                            categoryColors[event.category as keyof typeof categoryColors]
                          )}
                        >
                          {event.category}
                        </span>
                      )}
                    </div>
                    <div className='text-green mb-3 text-sm font-medium'>
                      {formatDate(event.date)} at {formatTime(event.date)}
                    </div>
                    {event.location && (
                      <div className='mb-2 flex items-center gap-2 text-sm text-gray-600'>
                        <MapPin className='h-4 w-4' />
                        {event.location}
                      </div>
                    )}
                    {event.description && <p className='text-gray-700'>{event.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
