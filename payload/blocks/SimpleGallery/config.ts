import { PayloadImageField } from '@/payload/fields/ImageType';
import SectionID from '@/payload/fields/SectionID';
import { Block } from 'payload';

const SimpleGallery: Block = {
  slug: 'simpleGallery',
  interfaceName: 'SimpleGallery',
  labels: {
    singular: { en: 'Simple Gallery', pt: 'Galeria Simples' },
    plural: { en: 'Simple Galleries', pt: 'Galerias Simples' },
  },
  admin: {
    group: 'Media',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: { en: 'Gallery Title', pt: 'Título da Galeria' },
      required: false,
      localized: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: { en: 'Gallery Description', pt: 'Descrição da Galeria' },
      required: false,
      localized: true,
    },
    {
      name: 'images',
      type: 'array',
      label: { en: 'Images', pt: 'Imagens' },
      required: true,
      fields: [PayloadImageField({ label: 'Image', name: 'image' })],
      interfaceName: 'SimpleGalleryBlockImage',
       admin: {
         components: {
           RowLabel: '@/payload/components/admin/GenericArrayRowLabel',
         },
       },
    },
    SectionID,
  ],
};

export default SimpleGallery;
