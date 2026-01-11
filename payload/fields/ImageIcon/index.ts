import { Field } from 'payload';
import { PayloadImageField } from '../ImageType';
import { icons } from 'lucide-react';

type ImageTypeGroupProps = {
  label?: string;
  name?: string;
  required?: boolean;
};

export const PayloadIconOrImage = (props?: ImageTypeGroupProps) => {
  const { label, name, required } = props || {
    label: 'Icon or Image',
    name: 'imageIcon',
    required: false,
  };

  return {
    name: name,
    label: label,
    type: 'group',
    interfaceName: 'ImageIcon',
    required: required,
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
        type: 'select',
        label: 'Icon (SVG)',
        admin: {
          description: 'Full list at https://lucide.dev/icons/ ',
          condition: (_, siblingData) => siblingData.type === 'icon',
          components: {
            Field: '@/payload/fields/ImageIcon/components/Field',
          },
        },
        options: Object.keys(icons).map((iconKey) => ({
          label: iconKey,
          value: iconKey,
        })),
        defaultValue: 'Star',
      },
    ],
  } as Field;
};
