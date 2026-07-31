import { Condition, FieldBase, GroupField } from 'payload';
import { ExternalImageField, ImageTypeField, UploadField } from '../Image/fields';

type ImageTypeGroupProps = Pick<FieldBase, 'label' | 'name' | 'required'> & {
  description?: string | Record<string, string>;
  hideGutter?: boolean;
  condition?: Condition;
};

export const PayloadImageField = ({
  label = 'Image Data',
  name = 'imageField',
  required = false,
  description,
  hideGutter = false,
  condition,
}: ImageTypeGroupProps): GroupField =>
  ({
    name: name,
    label: label,
    type: 'group',
    interfaceName: 'ImageType',
    required,
    admin: {
      description: description || {
        en: 'Upload an image or provide an external image URL',
        pt: 'Carregue uma imagem ou forneça um URL de imagem externo',
      },
      components: {
        Label: '@/payload/fields/ImageType/components/PayloadImageLabel',
      },
      hideGutter,
      condition: condition,
      disableListColumn: true,
      disableListFilter: true,
    },
    fields: [
      ImageTypeField({ required }),
      UploadField,
      ExternalImageField,
      {
        name: 'alt',
        type: 'text',
        label: { en: 'Caption / Alt Text', pt: 'Legenda / Texto Alternativo' },
        required,
        admin: {
          description: {
            en: 'Alt text for the image for accessibility and SEO | Caption Image',
            pt: 'Texto alternativo para acessibilidade e SEO | Legenda da Imagem',
          },
          condition: (_, siblingData) => siblingData.imageType === 'external',
          disableListColumn: true,
          disableListFilter: true,
        },
      },
      {
        name: 'height',
        type: 'number',
        label: { en: 'Height', pt: 'Altura' },
        admin: {
          description: { en: 'Height of the image in pixels', pt: 'Altura da imagem em píxeis' },
          condition: (data, siblingData) => siblingData.imageType === 'external',
          disableListColumn: true,
          disableListFilter: true,
        },
      },
    ],
    hooks: {
      afterChange: [
        ({ value }) => {
          if (!value) return;
          if (value.imageType !== 'none') return;

          return {
            imageType: 'none',
            image: null,
            externalImage: null,
            alt: null,
            height: null,
          };
        },
      ],
    },
  }) as GroupField;
