'use client';
import { useTranslation } from '@/i18n/client';
import { cn } from '@/lib/utils';
import { useLanguageCookie } from '@/utils/contexts/AppProvider';

type HawkLabelProps = {
  type: string;
  variant?: 'default' | 'green';
  design?: 'line' | 'badge';
};

const HawkLabel = ({ type, variant = 'default', design = 'line' }: HawkLabelProps) => {
  const lng = useLanguageCookie();
  const { t } = useTranslation(lng, 'common');
  return (
    <span
      className={cn(
        `mb-4 inline-block w-fit px-3 py-1 text-xs font-bold tracking-widest uppercase`,
        variant === 'green' ? 'border-green text-green' : 'border-white text-white',
        design === 'badge' ? 'border' : 'border-b'
      )}
    >
      {t(`label.${type}`, { defaultValue: type })}
    </span>
  );
};

export default HawkLabel;
