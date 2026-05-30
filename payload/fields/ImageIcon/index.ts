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
        label: { en: 'Type', pt: 'Tipo' },
        type: 'select',
        options: [
          { label: { en: 'Icon', pt: 'Ícone' }, value: 'icon' },
          { label: { en: 'Image', pt: 'Imagem' }, value: 'image' },
          { label: { en: 'None', pt: 'Nenhum' }, value: 'none' },
        ],
        admin: {
          description: 'Select whether to use an icon or an image.',
        },
      },
      {
        ...PayloadImageField({
          label: 'Imagem',
          name: 'image',
          required: false,
          condition: (_, siblingData) => siblingData.type === 'image',
        }),
      },
      PayloadLucideIcon({ condition: (_, siblingData) => siblingData.type === 'icon' }),
    ],
  } as Field;
};
