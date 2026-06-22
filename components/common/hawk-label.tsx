'use client';
import { useTranslation } from '@/i18n/client';
import { useLanguageCookie } from '@/utils/contexts/AppProvider';

type HawkLabelProps = {
  type: string;
  className?: string;
};

const HawkLabel = ({ type, className }: HawkLabelProps) => {
  const lng = useLanguageCookie();
  const { t } = useTranslation(lng, 'common');
  return (
    <span
      className={`mb-4 inline-block rounded-lg border border-white px-3 py-1 text-xs font-bold tracking-widest text-white uppercase ${className}`}
    >
      {t(`label.${type}`) || type}
    </span>
  );
};

export default HawkLabel;
