'use client';

import { getIcon } from '@/lib/icon';
import { useRowLabel } from '@payloadcms/ui';

const StatsLabel = () => {
  const { data } = useRowLabel<{
    icon?: string;
    number: string;
    label?: string;
  }>();
  const { icon, label } = data || {};
  const iconElement = icon && getIcon(icon);

  // Get the platform name or use a fallback
  return (
    <div style={{ textTransform: 'capitalize' }} className='flex gap-1'>
      {iconElement}
      {label || 'Menu'}
    </div>
  );
};

export default StatsLabel;
