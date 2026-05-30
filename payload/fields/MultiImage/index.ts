import { Condition, FieldBase, GroupField } from 'payload';

type MultiImageFieldProps = Pick<FieldBase, 'label' | 'name' | 'required'> & {
  description?: string | Record<string, string>;
  hideGutter?: boolean;
  condition?: Condition;
};

/**
 * MultiImageField — a reusable Payload GroupField that holds:
 *   • internalImages  — array of relations to the `media` collection
 *   • externalImages  — array of { url, alt } plain-text objects
 */
export const MultiImageField = ({
  label = 'Images',
  name = 'images',
  required = false,
  description,
  hideGutter = false,
  condition,
}: MultiImageFieldProps): GroupField =>
  ({
    name,
    label,
    type: 'group',
    interfaceName: 'MultiImageType',
    required,
    admin: {
      description: description || 'Add internal media uploads and/or external image URLs.',
      hideGutter,
      condition,
    },
    fields: [
      {
        name: 'internalImages',
        type: 'array',
        label: { en: 'Internal Images', pt: 'Imagens Internas' },
        required: false,
        admin: {
          description: 'Images uploaded to the Media library.',
          initCollapsed: true,
        },
        fields: [
          {
            name: 'image',
            type: 'upload',
            relationTo: 'media',
            label: { en: 'Media', pt: 'Média' },
            required: true,
          },
        ],
      },
      {
        name: 'externalImages',
        type: 'array',
        label: { en: 'External Images', pt: 'Imagens Externas' },
        required: false,
        admin: {
          description: 'Images hosted externally — provide a URL and alt text.',
          initCollapsed: true,
        },
        fields: [
          {
            name: 'url',
            type: 'text',
            label: { en: 'Image URL', pt: 'URL da Imagem' },
            required: true,
            admin: {
              description: 'Full URL of the external image (https://…)',
            },
          },
          {
            name: 'alt',
            type: 'text',
            label: { en: 'Alt Text', pt: 'Texto Alternativo' },
            required: true,
            admin: {
              description: 'Accessible description of the image.',
            },
          },
        ],
      },
    ],
  }) as GroupField;
