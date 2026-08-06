import * as LuIcons from 'react-icons/lu';
import { IconType } from 'react-icons';
import { FlagIcons } from './flags';

const getIcon = (iconName?: string | null) => {
  if (!iconName) return null;

  // Support both "Lu"-prefixed names and legacy unprefixed names (e.g. "ArrowRight" → "LuArrowRight")
  const prefixed = iconName.startsWith('Lu') ? iconName : `Lu${iconName}`;
  const Icon = (LuIcons as unknown as Record<string, IconType>)[prefixed];

  if (!Icon) return null;
  return <Icon className='size-6' />;
};

/* ================================================================== */
/*  Helper: render a flag icon by FlagIcons key                       */
/* ================================================================== */
export function FlagIcon({ country }: { country: keyof typeof FlagIcons }) {
  const Icon = FlagIcons[country];
  if (!Icon) return null;
  return (
    <span className='aspect-auto h-auto w-10'>
      {Icon({ title: country, className: 'w-full h-full rounded-full object-cover' })}
    </span>
  );
}

export { getIcon };
