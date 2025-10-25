import type { CollectionConfig } from 'payload';
import { authenticated } from '../access/authenticated';
import { authenticatedAdmin } from '../access/authenticatedAdmin';

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    create: authenticatedAdmin,
    delete: authenticatedAdmin,
    read: authenticated,
    update: authenticatedAdmin,
  },
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
