import type { Condition, Description, Field, GroupField } from 'payload';

type LinkTypeProps = {
  localizedLabel?: boolean;
  labelInformation?: string;
  condition?: Condition;
  description?: Description | string;
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
              description: {
                en: 'Choose whether this link is an internal reference to a document within the site or a custom/external URL.',
                pt: 'Escolha se este link é uma referência interna a um documento do site ou um URL externo/personalizado.',
              },
            },
            defaultValue: 'reference',
            required: true,
            options: [
              {
                label: { en: 'Internal link', pt: 'Link interno' },
                value: 'reference',
              },
              {
                label: { en: 'Custom URL | External link', pt: 'URL personalizado | Link externo' },
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
            label: { en: 'Open in new tab', pt: 'Abrir em nova aba' },
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
        description: {
          en: 'Select a document to link to from the existing collections present on the Administration Panel.',
          pt: 'Selecione um documento para ligar a partir das coleções existentes no Painel de Administração.',
        },
      },
      label: { en: 'Document to link to', pt: 'Documento a ligar' },
      relationTo: ['pages', 'hawk_projects'],
      required: true,
    },
    {
      name: 'url',
      type: 'text',
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'custom',
        description: {
          en: 'Enter the full URL for the link, including http:// or https://',
          pt: 'Introduza o URL completo do link, incluindo http:// ou https://',
        },
      },
      label: { en: 'Custom URL', pt: 'URL Personalizado' },
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
        label: { en: 'Label', pt: 'Rótulo' },
        required: false,
        localized: localizedLabel,
      },
      {
        name: 'section',
        type: 'text',
        label: { en: 'Section ID', pt: 'ID da Secção' },
        admin: {
          width: '50%',
          description: {
            en: 'Optional: Specify a section ID (without the #) to link to a specific section within the page.',
            pt: 'Opcional: Especifique um ID de secção (sem o #) para ligar a uma secção específica da página.',
          },
        },
        required: false,
        localized: false,
      },
    ],
  });

  return linkResult;
};
