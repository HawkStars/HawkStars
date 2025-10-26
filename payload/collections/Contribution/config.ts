type ContributionType =
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

export type ContributionSelectOption = { label: string; value: ContributionType };

export const priceOfContribution: Partial<Record<ContributionType, number>> = {
  OFFICE_CHAIR: 300,
  AUDITORIUM_CHAIR: 230,
  SIMULATOR_CHAIR: 350,
  LOUNGE_CHAIR: 260,
  WALL_NAME_COMPANY: 1800,
  WALL_NAME_SINGULAR: 500,
  TRAINING_ROOM_NAMING: 15000,
  BUILDING_NAMING: 380000,
};

export const contributionTypeOptions: ContributionSelectOption[] = [
  { label: 'Bank', value: 'BANK' },
  { label: 'Crypto', value: 'CRYPTO' },
  { label: 'Individual - Wall Name', value: 'WALL_NAME_SINGULAR' },
  { label: 'Company - Name on Wall', value: 'WALL_NAME_COMPANY' },
  { label: 'Office Chair', value: 'OFFICE_CHAIR' },
  { label: 'Simulator Chair', value: 'SIMULATOR_CHAIR' },
  { label: 'Lounge Chair', value: 'LOUNGE_CHAIR' },
  { label: 'Auditorium Chair', value: 'AUDITORIUM_CHAIR' },
  { label: 'Name on the Building', value: 'BUILDING_NAMING' },
  { label: 'Training Room Name', value: 'TRAINING_ROOM_NAMING' },
];
