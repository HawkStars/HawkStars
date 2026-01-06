import { Field } from 'payload';
import { ExternalImageField, ImageTypeField, UploadField } from '../Image/fields';

type ImageTypeGroupProps = {
  label?: string;
  name?: string;
  required?: boolean;
  description?: string;
  hideGutter?: boolean;
};

export const PayloadImageField = ({
  label = 'Image Data',
  name = 'imageField',
  required = false,
  description,
  hideGutter = false,
}: ImageTypeGroupProps): Field =>
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
    },
    fields: [
      ImageTypeField,
      UploadField,
      ExternalImageField,
      {
        name: 'alt',
        type: 'text',
        label: 'Label Text',
        required: true,
        admin: { description: 'Alt text for the image for accessibility and SEO | Caption Image' },
      },
    ],
  }) as Field;
