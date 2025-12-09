import { Field } from 'payload';

type ImageTypeGroupProps = {
  label: string;
  name: string;
};

export const PayloadImageField = ({ label, name }: ImageTypeGroupProps) =>
  ({
    name: name,
    label: label,
    type: 'group',
    interfaceName: 'ImageType',
    fields: [
      {
        name: 'imageType',
        type: 'select',
        label: 'Image Type',
        required: true,
        options: [
          { label: 'External Image', value: 'external' },
          { label: 'Uploaded Image/Media', value: 'upload' },
        ],
        admin: {
          description: 'Select whether to use an external image URL or upload an image/media file.',
        },
      },
      {
        name: 'image',
        type: 'upload',
        relationTo: 'media',
        label: 'Image',
        admin: {
          description: 'Upload an image or media file.',
          condition: (_, siblingData) => siblingData.imageType === 'upload',
        },
      },
      {
        name: 'externalImage',
        type: 'text',
        label: 'External Image URL',
        admin: {
          description: 'Provide the URL for the external image.',
          condition: (_, siblingData) => siblingData.imageType === 'external',
        },
      },
      { name: 'alt', type: 'text', label: 'Label Text', required: true },
    ],
  }) as Field;
