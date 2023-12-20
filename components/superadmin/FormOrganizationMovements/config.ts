import { SelectOption } from '@/components/utils/Select';

export type MovementType = 'credit' | 'debit';

const OrganizationTypeMovementOptions = [
  { label: 'Credit', value: 'credit', id: 'credit', disabled: false },
  { label: 'Debit', value: 'debit', id: 'debit', disabled: false },
] as SelectOption[];

const OrganizationMovementAPIMessages = {
  ERROR: 'Error while connecting with the database',
  SUCCESS: 'Added the organization movement',
  NO_USER_LOGGED_IN: 'User not logged in',
};

export { OrganizationTypeMovementOptions, OrganizationMovementAPIMessages };
