import type { ArrayField, Field } from 'payload';
import merge from 'lodash.merge';

import { link } from './link';

type LinkGroupOptions = {
  overrides?: Partial<ArrayField>;
  /**
   * Whether each button label is translated per language. On by default: a button
   * label is visitor-facing copy. (It used to be read from `overrides.localized`,
   * which every caller left unset when passing other overrides such as `maxRows`,
   * so no button label anywhere could be translated.)
   */
  localizedLabel?: boolean;
};

export const linkGroup = ({
  overrides = {},
  localizedLabel = true,
}: LinkGroupOptions = {}): Field => {
  const generatedLinkGroup: Field = {
    name: 'links',
    type: 'array',
    interfaceName: 'LinkGroupItem',
    fields: [link({ localizedLabel })],
    admin: {
      initCollapsed: true,
      components: {
        RowLabel: '@/payload/fields/LinkGroupLabel',
      },
    },
  };

  return merge(generatedLinkGroup, overrides);
};
