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
        label: 'Internal Images',
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
            label: 'Media',
            required: true,
          },
        ],
      },
      {
        name: 'externalImages',
        type: 'array',
        label: 'External Images',
        required: false,
        admin: {
          description: 'Images hosted externally — provide a URL and alt text.',
          initCollapsed: true,
        },
        fields: [
          {
            name: 'url',
            type: 'text',
            label: 'Image URL',
            required: true,
            admin: {
              description: 'Full URL of the external image (https://…)',
            },
          },
          {
            name: 'alt',
            type: 'text',
            label: 'Alt Text',
            required: true,
            admin: {
              description: 'Accessible description of the image.',
            },
          },
        ],
      },
    ],
  }) as GroupField;
