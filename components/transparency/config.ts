import { Contribution } from '@/payload-types';

export type ContributionType =
  | 'BANK'
  | 'CRYPTO'
  | 'WALL_NAME_SINGULAR'
  | 'WALL_NAME_COMPANY'
  | 'OFFICE_CHAIR'
  | 'SIMULATOR_CHAIR'
  | 'LOUNGE_CHAIR'
  | 'AUDITORIUM_CHAIR'
  | 'BUILDING_NAMING'
  | 'TRAINING_ROOM_NAMING';

export type TransparencyContribution = Pick<
  Contribution,
  | 'contribution_date'
  | 'donor'
  | 'is_anonymous'
  | 'id'
  | 'value'
  | 'contribution_type'
  | 'updatedAt'
>;
