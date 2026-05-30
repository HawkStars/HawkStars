import { Field } from 'payload';

const ImageTypeField = ({ required = false }: { required: boolean }) =>
  ({
    name: 'imageType',
    type: 'select',
    label: { en: 'Image Type', pt: 'Tipo de Imagem' },
    required,
    options: [
      { label: { en: 'External Image', pt: 'Imagem Externa' }, value: 'external' },
      { label: { en: 'Uploaded Image/Media', pt: 'Imagem/Média Carregada' }, value: 'upload' },
      { label: { en: 'None', pt: 'Nenhuma' }, value: 'none' },
    ],
    admin: {
      description: {
        en: 'Select whether to use an external image URL or upload an image/media file.',
        pt: 'Selecione se pretende usar um URL de imagem externo ou carregar um ficheiro de imagem/média.',
      },
    },
  }) as Field;

const UploadField: Field = {
  name: 'image',
  type: 'upload',
  relationTo: 'media',
  label: { en: 'Image', pt: 'Imagem' },
  admin: {
    description: {
      en: 'Upload an image or media file.',
      pt: 'Carregue um ficheiro de imagem ou média.',
    },
    condition: (_, siblingData) => siblingData.imageType === 'upload',
  },
};

const ExternalImageField: Field = {
  name: 'externalImage',
  type: 'text',
  label: { en: 'External Image URL', pt: 'URL de Imagem Externa' },
  admin: {
    description: {
      en: 'Provide the URL for the external image.',
      pt: 'Forneça o URL da imagem externa.',
    },
    condition: (_, siblingData) => siblingData.imageType === 'external',
  },
};

export { ImageTypeField, UploadField, ExternalImageField };
