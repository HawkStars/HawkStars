import { ContributionType } from '@/components/transparency/config';

const ContributionTypesLabels = [
  { label: 'Bank', value: 'BANK', id: 'BANK', disabled: false },
  { label: 'Crypto', value: 'CRYPTO', id: 'CRYPTO', disabled: false },
  {
    label: 'Individual Name at Wall',
    value: 'WALL_NAME_SINGULAR',
    id: 'WALL_NAME_SINGULAR',
    disabled: false,
  },
  {
    label: 'Company Logo at Wall',
    value: 'WALL_NAME_COMPANY',
    id: 'WALL_NAME_COMPANY',
    disabled: false,
  },
  {
    label: 'Office Chair',
    value: 'OFFICE_CHAIR',
    id: 'OFFICE_CHAIR',
    disabled: false,
  },
  {
    label: 'Simulator Chair',
    value: 'SIMULATOR_CHAIR',
    id: 'SIMULATOR_CHAIR',
    disabled: false,
  },
  {
    label: 'Lounge Chair',
    value: 'LOUNGE_CHAIR',
    id: 'LOUNGE_CHAIR',
    disabled: false,
  },
  {
    label: 'Auditorium Chair',
    value: 'AUDITORIUM_CHAIR',
    id: 'AUDITORIUM_CHAIR',
    disabled: false,
  },
  {
    label: 'Building Naming/Branding',
    value: 'BUILDING_NAMING',
    id: 'BUILDING_NAMING',
    disabled: false,
  },
  {
    label: 'Training Room Naming',
    value: 'TRAINING_ROOM_NAMING',
    id: 'TRAINING_ROOM_NAMING',
    disabled: false,
  },
] as {
  label: string;
  value: ContributionType;
  id: ContributionType;
  disabled: boolean;
}[];

const ContributionPricing: Partial<Record<ContributionType, number>> = {
  OFFICE_CHAIR: 300,
  AUDITORIUM_CHAIR: 230,
  SIMULATOR_CHAIR: 350,
  LOUNGE_CHAIR: 260,
  WALL_NAME_COMPANY: 1800,
  WALL_NAME_SINGULAR: 500,
  TRAINING_ROOM_NAMING: 15000,
  BUILDING_NAMING: 380000,
};

const hasMinimumContribution = [
  'WALL_NAME_COMPANY',
  'WALL_NAME_SINGULAR',
  'TRAINING_ROOM_NAMING',
  'BUILDING_NAMING',
] as ContributionType[];

export { ContributionTypesLabels, ContributionPricing, hasMinimumContribution };
