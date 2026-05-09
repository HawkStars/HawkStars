import * as LuIcons from 'react-icons/lu';
import { IconType } from 'react-icons';

const getIcon = (iconName?: string | null) => {
  if (!iconName) return null;

  // Support both "Lu"-prefixed names and legacy unprefixed names (e.g. "ArrowRight" → "LuArrowRight")
  const prefixed = iconName.startsWith('Lu') ? iconName : `Lu${iconName}`;
  const Icon = (LuIcons as unknown as Record<string, IconType>)[prefixed];

  if (!Icon) {
    console.warn(`Icon "${iconName}" (tried "${prefixed}") not found in react-icons/lu`);
    return null;
  }

  return <Icon className='size-6' />;
};

export { getIcon };
