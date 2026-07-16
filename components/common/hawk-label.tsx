'use client';
import { useTranslation } from '@/i18n/client';
import { useLanguageCookie } from '@/utils/contexts/AppProvider';

type HawkLabelProps = {
  type: string;
  variant?: 'default' | 'green';
};

const HawkLabel = ({ type, variant = 'default' }: HawkLabelProps) => {
  const lng = useLanguageCookie();
  const { t } = useTranslation(lng, 'common');
  return (
    <span
      className={`mb-4 inline-block w-fit border-b px-3 py-1 text-xs font-bold tracking-widest uppercase ${
        variant === 'green' ? 'border-green text-green' : 'border-white text-white'
      }`}
    >
      {t(`label.${type}`, { defaultValue: type })}
    </span>
  );
};

export default HawkLabel;
