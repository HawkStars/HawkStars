import { Field } from 'payload';

const ImageTypeField: Field = {
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
};

const UploadField: Field = {
  name: 'image',
  type: 'upload',
  relationTo: 'media',
  label: 'Image',
  admin: {
    description: 'Upload an image or media file.',
    condition: (_, siblingData) => siblingData.imageType === 'upload',
  },
};

const ExternalImageField: Field = {
  name: 'externalImage',
  type: 'text',
  label: 'External Image URL',
  admin: {
    description: 'Provide the URL for the external image.',
    condition: (_, siblingData) => siblingData.imageType === 'external',
  },
};

export { ImageTypeField, UploadField, ExternalImageField };
