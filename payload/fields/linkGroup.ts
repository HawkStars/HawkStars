import type { ArrayField, Field } from 'payload';
import merge from 'lodash.merge';

import { link } from './link';

type LinkGroupType = (options?: { overrides?: Partial<ArrayField> }) => Field;

export const linkGroup: LinkGroupType = ({ overrides = { localized: false } } = {}) => {
  const { localized } = overrides;
  const generatedLinkGroup: Field = {
    name: 'links',
    type: 'array',
    interfaceName: 'LinkGroupItem',
    fields: [link({ localizedLabel: localized })],
    admin: {
      initCollapsed: true,
      components: {
        RowLabel: '@/payload/fields/LinkGroupLabel',
      },
    },
  };

  return merge(generatedLinkGroup, overrides);
};
