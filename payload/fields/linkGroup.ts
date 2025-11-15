import type { ArrayField, Field } from 'payload';
import merge from 'lodash.merge';

import { link } from './link';

type LinkGroupType = (options?: { overrides?: Partial<ArrayField> }) => Field;

export const linkGroup: LinkGroupType = ({ overrides = {} } = {}) => {
  const generatedLinkGroup: Field = {
    name: 'links',
    type: 'array',
    fields: [link({})],
    admin: {
      initCollapsed: true,
    },
  };

  return merge(generatedLinkGroup, overrides);
};
