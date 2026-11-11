import { CONTRIBUTION_TYPE_ORDER, ContributionType, ContributionTypeTotal } from './config';

/** Per-type totals for stories: every type present, zero unless given. */
export const makeTotals = (
  values: Partial<Record<ContributionType, number>>
): ContributionTypeTotal[] =>
  CONTRIBUTION_TYPE_ORDER.map((type) => {
    const sum = values[type] ?? 0;
    return { type, sum, count: sum > 0 ? Math.max(1, Math.round(sum / 500)) : 0 };
  });

export const SAMPLE_TOTALS = makeTotals({
  BANK: 62000,
  CRYPTO: 4500,
  WALL_NAME_SINGULAR: 18000,
  WALL_NAME_COMPANY: 35000,
  OFFICE_CHAIR: 12000,
  SIMULATOR_CHAIR: 9000,
  LOUNGE_CHAIR: 6000,
  AUDITORIUM_CHAIR: 21000,
  BUILDING_NAMING: 50000,
  TRAINING_ROOM_NAMING: 15000,
});
