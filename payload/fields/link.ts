import type { Condition, Field, GroupField } from 'payload';

type LinkTypeProps = {
  localizedLabel?: boolean;
  labelInformation?: string;
  condition?: Condition;
  description?: string;
  name?: string;
  visible?: boolean;
};

export const link = (props?: LinkTypeProps) => {
  const { localizedLabel, labelInformation, condition, description, name, visible } = props || {
    localizedLabel: false,
    labelInformation: 'Link',
    visible: false,
  };
  const linkResult: GroupField = {
    name: name || 'link',
    label: labelInformation,
    type: 'group',
    interfaceName: 'LinkField',
    admin: {
      hideGutter: true,
      description,
      condition,
    },
    fields: [
      {
        type: 'row',
        fields: [
          {
            name: 'type',
            type: 'radio',
            admin: {
              layout: 'horizontal',
              width: '50%',
              description:
                'Choose whether this link is an internal reference to a document within the site or a custom/external URL.',
            },
            defaultValue: 'reference',
            required: true,
            options: [
              {
                label: 'Internal link',
                value: 'reference',
              },
              {
                label: 'Custom URL | External link',
                value: 'custom',
              },
            ],
          },
          {
            name: 'newTab',
            type: 'checkbox',
            required: false,
            defaultValue: false,
            admin: {
              style: {
                alignSelf: 'center',
              },
              width: '25%',
            },
            label: 'Open in new tab',
          },
          {
            name: 'visible',
            type: 'checkbox',
            defaultValue: true,
            admin: {
              style: { alignSelf: 'center' },
              width: '25%',
            },
            hidden: !visible,
          },
        ],
      },
    ],
  };

  const linkTypes: Field[] = [
    {
      name: 'reference',
      type: 'relationship',
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'reference',
        description:
          'Select a document to link to from the existing collections present on the Administration Panel.',
      },
      label: 'Document to link to',
      relationTo: ['pages', 'hawk_projects'],
      required: true,
    },
    {
      name: 'url',
      type: 'text',
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'custom',
        description: 'Enter the full URL for the link, including http:// or https://',
      },
      label: 'Custom URL',
      required: true,
    },
  ];

  linkTypes.map((linkType) => ({
    ...linkType,
    admin: {
      ...linkType.admin,
      width: '50%',
    },
  }));

  linkResult.fields.push({
    type: 'row',
    fields: [
      ...linkTypes,
      {
        name: 'label',
        type: 'text',
        admin: {
          width: '50%',
        },
        label: 'Label',
        required: false,
        localized: localizedLabel,
      },
      {
        name: 'section',
        type: 'text',
        label: 'Section ID',
        admin: {
          width: '50%',
          description:
            'Optional: Specify a section ID (without the #) to link to a specific section within the page.',
        },
        required: false,
        localized: false,
      },
    ],
  });

  return linkResult;
};
