import type { UpcomingHawkEventBlock as UpcomingHawkEventBlockProps } from '@/payload-types';
import { getImagePayloadUrl } from '@/lib/image';
import { UpcomingHawkEventBlockView } from './UpcomingHawkEventBlockView';
import { getUpcomingEventForBlock } from '@/lib/payload/queries/blocks';
import { Language } from '@/i18n/settings';

const typeLabels: Record<string, string> = {
  local_event: 'Local Event',
  international_event: 'International Event',
  other: 'Other',
};

// Server component. The client version fetched over REST after hydration — and did it
// against the *projects* endpoint (`API_CLIENT_PATHS.projects`), so this block was
// never showing an event at all. It also passed no locale and no date filter despite
// being the "upcoming" block.
export const UpcomingHawkEventBlock = async ({
  title,
  subtitle,
  eventType,
  linkLabel = 'Learn more',
  sectionId,
  lng,
}: UpcomingHawkEventBlockProps & { lng: Language }) => {
  const upcomingEvent = await getUpcomingEventForBlock(lng, eventType);

  if (!upcomingEvent) return null;

  const image = getImagePayloadUrl(upcomingEvent.image);

  return (
    <UpcomingHawkEventBlockView
      title={title}
      subtitle={subtitle}
      linkLabel={linkLabel}
      sectionId={sectionId}
      event={{
        heading: upcomingEvent.heading,
        subheading: upcomingEvent.subheading,
        description: upcomingEvent.description,
        badge: upcomingEvent.type_event
          ? typeLabels[upcomingEvent.type_event] || upcomingEvent.type_event
          : null,
        image: image ?? null,
        href: `/events/${upcomingEvent.slug}`,
      }}
    />
  );
};
