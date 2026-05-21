import { Field } from 'payload';
import * as LuIcons from 'react-icons/lu';

type PayloadLucideIcon = {
  condition: (data: Record<string, unknown>, siblingData: Record<string, unknown>) => boolean;
};

const PayloadLucideIcon = (props?: PayloadLucideIcon) => {
  return {
    name: 'icon',
    type: 'select',
    label: 'Icon (SVG Lucide)',
    interfaceName: 'LucideIcon',
    required: false,
    admin: {
      description: 'Optional icon from Lucide (https://lucide.dev/icons/)',
      condition: props?.condition ?? true,
    },
    components: {
      Field: '@/payload/fields/ImageIcon/components/Field',
    },
    options: Object.keys(LuIcons).map((iconKey) => ({
      label: iconKey,
      value: iconKey,
    })),
  } as Field;
};

export default PayloadLucideIcon;
