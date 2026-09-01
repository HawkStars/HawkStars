import { HawkProject } from '@/payload-types';

// Mirrors the `project_type` select field's options in
// payload/collections/HawkProject/index.ts -- kept as an explicit ordered
// list (rather than derived from the schema at runtime) so the type filter's
// option order is stable and doesn't depend on Payload's admin config shape.
export const PROJECT_TYPES: HawkProject['project_type'][] = [
  'youth_exchange',
  'training_course',
  'seminar',
  'partnership',
  'discover_eu',
  'other',
];
