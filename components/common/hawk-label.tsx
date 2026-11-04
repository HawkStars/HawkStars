'use client';

import { useTranslation } from '@/i18n/client';
import { cn } from '@/lib/utils';
import { useLanguageCookie } from '@/utils/contexts/AppProvider';

type HawkLabelProps = {
  type: string;
  variant?: 'default' | 'green' | 'terracotta';
  design?: 'line' | 'badge';
  className?: string;
};

const HawkLabel = ({ type, variant = 'default', design = 'line', className }: HawkLabelProps) => {
  const lng = useLanguageCookie();
  const { t } = useTranslation(lng, 'common');
  return (
    <span
      className={cn(
        `mb-4 inline-block w-fit px-3 py-1 text-xs font-bold tracking-widest uppercase`,
        {
          default: 'border-white text-white',
          green: 'border-green text-green',
          terracotta: 'border-terracotta-dark text-terracotta-dark',
        }[variant],
        design === 'badge' ? 'border' : 'border-b',
        className
      )}
    >
      {t(`label.${type}`, { defaultValue: type })}
    </span>
  );
};

export default HawkLabel;
