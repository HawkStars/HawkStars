import React from 'react';
import type { UpcomingHawkEventBlock as UpcomingHawkEventBlockProps } from '@/payload-types';
import type { Where } from 'payload';
import { getPayloadConfig } from '@/lib/payload/server';
import { getImagePayloadUrl } from '@/lib/image';
import { UpcomingHawkEventBlockView } from './UpcomingHawkEventBlockView';

const typeLabels: Record<string, string> = {
  erasmus: 'Erasmus +',
  local_event: 'Local Event',
  international_event: 'International Event',
  other: 'Other',
};

export const UpcomingHawkEventBlock: React.FC<UpcomingHawkEventBlockProps> = async ({
  title,
  subtitle,
  eventType,
  linkLabel = 'Learn more',
  sectionId,
}) => {
  const payload = await getPayloadConfig();

  const where: Where = {};

  if (eventType && eventType.length > 0) {
    where.type_event = { in: eventType };
  }

  const result = await payload.find({
    collection: 'hawk_projects',
    where,
    sort: '-createdAt',
    limit: 1,
  });

  const doc = result.docs[0] ?? null;

  if (!doc) {
    return null;
  }

  const image = getImagePayloadUrl(doc.image);

  return (
    <UpcomingHawkEventBlockView
      title={title}
      subtitle={subtitle}
      linkLabel={linkLabel}
      sectionId={sectionId}
      event={{
        heading: doc.heading,
        subheading: doc.subheading,
        description: doc.description,
        badge: doc.type_event ? (typeLabels[doc.type_event] || doc.type_event) : null,
        image: image ?? null,
        href: `/events/${doc.slug}`,
      }}
    />
  );
};
