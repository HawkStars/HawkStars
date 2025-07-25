import type { CollectionConfig } from 'payload';

export const Contribution: CollectionConfig = {
  slug: 'contributions',
  fields: [
    { type: 'text', name: 'donor', label: 'The name of the donor', required: true },
    {
      type: 'checkbox',
      name: 'is_confirmed',
      label: 'Payment is Confirmed',
    },
    {
      type: 'checkbox',
      name: 'is_anonymous',
      label: 'Donor is anonymous',
    },
    {
      type: 'number',
      name: 'value',
      label: 'Donation Value',
      required: true,
      validate: (value: number | undefined | null) =>
        (value && value > 0) || 'Value must be greater than 0',
    },
    { type: 'date', name: 'contribution_date', label: 'Contribution Date', required: true },
    {
      type: 'select',
      name: 'contribution_type',
      label: 'Contribution Type',
      required: true,
      options: [
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
      ],
    },
    { type: 'text', name: 'extra_info', label: 'Extra Information' },
  ],
  defaultSort: '-contribution_date',
};
