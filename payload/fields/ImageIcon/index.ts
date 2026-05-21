import { Field } from 'payload';
import { PayloadImageField } from '../ImageType';
import PayloadLucideIcon from './payload-lucide-icon';

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
          { label: 'None', value: 'none' },
        ],
        admin: {
          description: 'Select whether to use an icon or an image.',
        },
      },
      {
        ...PayloadImageField({
          label: 'Image',
          name: 'image',
          required: false,
          condition: (_, siblingData) => siblingData.type === 'image',
        }),
      },
      PayloadLucideIcon({ condition: (_, siblingData) => siblingData.type === 'icon' }),
    ],
  } as Field;
};
