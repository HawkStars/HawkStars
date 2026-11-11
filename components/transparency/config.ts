import { Contribution } from '@/payload-types';

export type ContributionType = Contribution['contribution_type'];

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

/** The current project's fundraising goal, in euros. */
export const PROJECT_GOAL = 900000;

/** Confirmed total for one contribution type. */
export type ContributionTypeTotal = { type: ContributionType; sum: number; count: number };

export type ContributionFamily = 'donation' | 'wall' | 'chair' | 'naming';

/**
 * Contribution types grouped into families, in display order. Each family takes one
 * org accent and each type a shade of it, so the progress bar reads as four groups
 * (green donations, ink wall names, terracotta chairs, gold naming rights) without
 * adding colours to the palette.
 */
export const CONTRIBUTION_FAMILIES: { family: ContributionFamily; types: ContributionType[] }[] = [
  { family: 'donation', types: ['BANK', 'CRYPTO'] },
  { family: 'wall', types: ['WALL_NAME_SINGULAR', 'WALL_NAME_COMPANY'] },
  {
    family: 'chair',
    types: ['OFFICE_CHAIR', 'SIMULATOR_CHAIR', 'LOUNGE_CHAIR', 'AUDITORIUM_CHAIR'],
  },
  { family: 'naming', types: ['BUILDING_NAMING', 'TRAINING_ROOM_NAMING'] },
];

/** Fill class per type — literal strings so Tailwind can see them. */
export const CONTRIBUTION_COLOR: Record<ContributionType, string> = {
  BANK: 'bg-green',
  CRYPTO: 'bg-green/55',
  WALL_NAME_SINGULAR: 'bg-ink',
  WALL_NAME_COMPANY: 'bg-ink/55',
  OFFICE_CHAIR: 'bg-terracotta-dark',
  SIMULATOR_CHAIR: 'bg-terracotta',
  LOUNGE_CHAIR: 'bg-terracotta/65',
  AUDITORIUM_CHAIR: 'bg-terracotta/40',
  BUILDING_NAMING: 'bg-gold',
  TRAINING_ROOM_NAMING: 'bg-gold/55',
};

export const CONTRIBUTION_TYPE_ORDER: ContributionType[] = CONTRIBUTION_FAMILIES.flatMap(
  ({ types }) => types
);
