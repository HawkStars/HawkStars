import { Condition, FieldBase, GroupField } from 'payload';
import { ExternalImageField, ImageTypeField, UploadField } from '../Image/fields';

type ImageTypeGroupProps = Pick<FieldBase, 'label' | 'name' | 'required'> & {
  description?: string;
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
      description: description || 'Upload an image or provide an external image URL',
      components: {
        Label: '@/payload/fields/ImageType/components/PayloadImageLabel',
      },
      hideGutter,
      condition: condition,
    },
    fields: [
      ImageTypeField({ required }),
      UploadField,
      ExternalImageField,
      {
        name: 'alt',
        type: 'text',
        label: 'Caption / Alt Text',
        required,
        admin: {
          description: 'Alt text for the image for accessibility and SEO | Caption Image',
          condition: (_, siblingData) => siblingData.imageType !== 'none',
        },
      },
      {
        name: 'height',
        type: 'number',
        label: 'Height',
        admin: {
          description: 'Height of the image in pixels',
          condition: (data, siblingData) => siblingData.imageType === 'external',
        },
      },
    ],
    hooks: {
      afterChange: [
        ({ value }) => {
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
