import { SelectOption } from '@/components/utils/Select';

export type MovementType = 'credit' | 'debit';

const OrganizationTypeMovementOptions = [
  { label: 'Credit', value: 'credit', id: 'credit', disabled: false },
  { label: 'Debit', value: 'debit', id: 'debit', disabled: false },
] as SelectOption[];

export { OrganizationTypeMovementOptions };
