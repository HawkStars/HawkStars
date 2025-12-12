import { Field } from 'payload';
import { PayloadImageField } from '../ImageType';

type ImageTypeGroupProps = {
  label?: string;
  name?: string;
};

export const PayloadIconOrImage = (props?: ImageTypeGroupProps) => {
  const { label, name } = props || {
    label: 'Icon | Image',
    name: 'imageIcon',
  };

  return {
    name: name,
    label: label,
    type: 'group',
    interfaceName: 'ImageIcon',
    admin: {
      hideGutter: true,
    },
    fields: [
      {
        name: 'type',
        type: 'select',
        options: [
          { label: 'Icon', value: 'icon' },
          { label: 'Image', value: 'image' },
        ],
        admin: {
          description: 'Select whether to use an icon or an image.',
        },
      },
      {
        name: 'image',
        label: 'Image',
        admin: {
          description: 'Upload an image or media file.',
          condition: (_, siblingData) => siblingData.type === 'image',
          hideGutter: true,
        },
        ...PayloadImageField({ label: 'Image' }),
      },
      {
        name: 'icon',
        type: 'text',
        label: 'Icon (SVG)',
        admin: {
          description: 'Pick an icon from https://lucide.dev/icons/ and paste the SVG code here.',
          condition: (_, siblingData) => siblingData.type === 'icon',
          components: {},
        },
      },
    ],
  } as Field;
};
