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
      description: description || {
        en: 'Add internal media uploads and/or external image URLs.',
        pt: 'Adicione uploads de média internos e/ou URLs de imagens externas.',
      },
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
          description: {
            en: 'Images uploaded to the Media library.',
            pt: 'Imagens carregadas na biblioteca de Média.',
          },
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
          description: {
            en: 'Images hosted externally — provide a URL and alt text.',
            pt: 'Imagens alojadas externamente — forneça um URL e texto alternativo.',
          },
          initCollapsed: true,
        },
        fields: [
          {
            name: 'url',
            type: 'text',
            label: { en: 'Image URL', pt: 'URL da Imagem' },
            required: true,
            admin: {
              description: {
                en: 'Full URL of the external image (https://…)',
                pt: 'URL completo da imagem externa (https://…)',
              },
            },
          },
          {
            name: 'alt',
            type: 'text',
            label: { en: 'Alt Text', pt: 'Texto Alternativo' },
            required: true,
            admin: {
              description: {
                en: 'Accessible description of the image.',
                pt: 'Descrição acessível da imagem.',
              },
            },
          },
        ],
      },
    ],
  }) as GroupField;
