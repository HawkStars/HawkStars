import type { CollectionConfig } from 'payload';

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  fields: [
    { type: 'text', name: 'firstName', label: 'First Name', defaultValue: '' },
    { type: 'text', name: 'lastName', label: 'Last Name', defaultValue: '' },
    { type: 'checkbox', name: 'isAdmin', label: 'Is Admin', defaultValue: false },
    { type: 'checkbox', name: 'isEditor', label: 'Is Editor', defaultValue: false },
  ],
};
