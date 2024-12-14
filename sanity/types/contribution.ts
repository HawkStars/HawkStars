import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'contribution',
  title: 'Contribution',
  type: 'document',
  fields: [
    defineField({
      name: 'donor',
      title: 'Donor',
      description: 'The name of the donor',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'is_confirmed',
      title: 'Payment is Confirmed',
      type: 'boolean',
      description: 'Check if the payment has been confirmed',
      initialValue: false,
    }),
    defineField({
      name: 'is_anonymous',
      title: 'Donor is anonymous',
      description: 'Check if the donor wants to be anonymous',
      type: 'boolean',
      hidden: ({ document }) => !document?.is_confirmed,
    }),
    defineField({
      name: 'value',
      title: 'Donation Value',
      type: 'number',
      hidden: ({ document }) => !document?.is_confirmed,
    }),
    defineField({
      name: 'contribution_date',
      title: 'Contribution Date',
      type: 'date',
      hidden: ({ document }) => !document?.is_confirmed,
    }),
    defineField({
      name: 'contribution_type',
      title: 'Contribution Type',
      type: 'string',
      hidden: ({ document }) => !document?.is_confirmed,
      options: {
        list: [
          { title: 'Bank', value: 'BANK' },
          { title: 'Crypto', value: 'CRYPTO' },
          { title: 'Individual - Wall Name', value: 'WALL_NAME_SINGULAR' },
          { title: 'Comapny - Name on Wall', value: 'WALL_NAME_COMPANY' },
          { title: 'Office Chair', value: 'OFFICE_CHAIR' },
          { title: 'Simulator Chair', value: 'SIMULATOR_CHAIR' },
          { title: 'Lounge Chair', value: 'LOUNGE_CHAIR' },
          { title: 'Auditorium Chair', value: 'AUDITORIUM_CHAIR' },
          { title: 'Name on the Building', value: 'BUILDING_NAMING' },
          { title: 'Training Room Name', value: 'TRAINING_ROOM_NAMING' },
        ],
        layout: 'dropdown',
      },
    }),
  ],
});
