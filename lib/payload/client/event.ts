import { Where } from 'payload';
import { stringify } from 'qs-esm';

type FetchEventOptions = {
  controller: AbortController;
  eventType?: ('local_event' | 'international_event' | 'other')[] | null | undefined;
};

const fetchEvent = async ({ controller, eventType }: FetchEventOptions) => {
  const where: Where = {};
  if (eventType && eventType.length > 0) where.type_event = { in: eventType };

  const stringifiedQuery = stringify({ where, limit: 1 }, { addQueryPrefix: true });

  try {
    const response = await fetch(`/api/hawk_events${stringifiedQuery}`, {
      method: 'GET',
      signal: controller.signal,
    });

    if (!response.ok) {
      console.error('Failed to fetch upcoming event:', response.statusText);
      return null;
    }

    const data = await response.json();
    return data?.docs?.[0] || null;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return null;
    console.error('Error fetching upcoming event:', error);
    return null;
  }
};

export { fetchEvent };
