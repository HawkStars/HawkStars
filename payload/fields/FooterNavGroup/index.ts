import { GroupField } from 'payload';
import { link } from '../link';

export const FooterNavGroup: GroupField = {
  name: 'column',
  required: true,
  type: 'group',
  interfaceName: 'FooterNavGroup',
  admin: {
    description: {
      en: 'Footer column. If there is only 1 link, it will be displayed without a title.',
      pt: 'Coluna do rodapé. Se tiver apenas 1 link, será exibida sem título.',
    },
    components: {
      Label: '@/payload/fields/FooterNavGroup/components/Label',
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: { en: 'Title', pt: 'Título' },
      required: false,
      localized: true,
    },
    {
      name: 'data',
      label: { en: 'Links', pt: 'Links' },
      type: 'array',
      fields: [link({ visible: true, localizedLabel: true, labelInformation: 'Footer Link' })],
      maxRows: 6,
      minRows: 1,
      required: true,
      localized: false,
      admin: {
        components: {
          RowLabel: '@/payload/fields/Link/components/LinkLabel',
        },
      },
    },
  ],
};
