'use client';

import { LuCalendarDays, LuMapPin } from 'react-icons/lu';
import { HawkEvent } from '@/payload-types';
import { transformUrl, SITE_GET_URLS } from '@/utils/paths';
import { formatDate, formatDateRange } from '@/utils/date';
import { useTranslation } from '@/i18n/client';
import { Language } from '@/i18n/settings';
import ListingCard, { ListingMeta } from '@/components/shared/ListingCard';

type EventCardProps = {
  event: HawkEvent;
  index: number;
  lng: Language;
  /** Wide card spanning the grid row — the first item of a list. */
  featured?: boolean;
};

/** Event teaser on the shared `ListingCard`, with a calendar tile for the start date. */
const EventCard = ({ event, index, lng, featured = false }: EventCardProps) => {
  const { t } = useTranslation(lng, 'events');
  const dateLabel = formatDateRange(event.date, event.isDateRange ? event.endDate : null, lng);
  const day = formatDate(event.date, lng, { day: 'numeric' });
  const month = formatDate(event.date, lng, { month: 'short' }).replace('.', '');

  const meta: ListingMeta[] = [];
  if (dateLabel) meta.push({ icon: LuCalendarDays, text: dateLabel, dateTime: event.date });
  if (event.location) meta.push({ icon: LuMapPin, text: event.location });

  return (
    <ListingCard
      href={transformUrl(lng, `${SITE_GET_URLS.events}/${event.slug}`)}
      title={event.heading}
      image={event.image}
      badge={event.type_event ? t(`types.${event.type_event}`) : null}
      dateChip={day && month ? { day, month } : null}
      meta={meta}
      description={event.description}
      ctaLabel={t('viewEvent')}
      featured={featured}
      preload={index === 0}
      headingLevel='h3'
    />
  );
};

export default EventCard;
