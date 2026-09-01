import { HawkEvent } from '@/payload-types';

// Mirrors the `type_event` select field's options in
// payload/collections/HawkEvent -- see components/projects/constants.ts for
// why this is an explicit list rather than derived from the schema.
export const EVENT_TYPES: NonNullable<HawkEvent['type_event']>[] = [
  'local_event',
  'international_event',
  'other',
];
