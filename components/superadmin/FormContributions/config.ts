import { SelectOption } from '@/components/utils/Select';

export type ContributionType =
  | 'bank'
  | 'crypto'
  | 'wall_name_singular'
  | 'wall_name_company'
  | 'office_chair'
  | 'simulator_chair'
  | 'lounge_chair'
  | 'auditorium_chair'
  | 'building_naming'
  | 'training_room_naming';

const ContributionTypesLabels = [
  { label: 'Bank', value: 'bank', id: 'bank', disabled: false },
  { label: 'Crypto', value: 'crypto', id: 'crypto', disabled: false },
  {
    label: 'Individual Wall Name',
    value: 'wall_name_singular',
    id: 'wall_name_singular',
    disabled: false,
  },
  {
    label: 'Company Wall Name',
    value: 'wall_name_company',
    id: 'wall_name_company',
    disabled: false,
  },
  {
    label: 'Office Chair',
    value: 'office_chair',
    id: 'office_chair',
    disabled: false,
  },
  {
    label: 'Simulator Chair',
    value: 'simulator_chair',
    id: 'simulator_chair',
    disabled: false,
  },
  {
    label: 'Lounge Chair',
    value: 'lounge_chair',
    id: 'lounge_chair',
    disabled: false,
  },
  {
    label: 'Auditorium Chair',
    value: 'auditorium_chair',
    id: 'auditorium_chair',
    disabled: false,
  },
  {
    label: 'Building Naming/Branding',
    value: 'building_naming',
    id: 'building_naming',
    disabled: false,
  },
  {
    label: 'Training Room Naming',
    value: 'training_room_naming',
    id: 'training_room_naming',
    disabled: false,
  },
] as SelectOption[];

export { ContributionTypesLabels };
