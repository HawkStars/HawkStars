type PaymentStepProps = {
  onBack: () => void;
  onNext: () => void;
};

import { useTranslation } from '@/i18n/client';
import { useLanguageCookie } from '@/utils/contexts/AppProvider';

const PaymentStep = ({ onBack, onNext }: PaymentStepProps) => {
  const lng = useLanguageCookie();
  const { t } = useTranslation(lng, 'contribute');
  return (
    <div className='flex flex-col gap-5'>
      <p className='text-center text-[15px] leading-relaxed text-[#333]'>
        {t('donation_widget.payment.description')}
      </p>

      {/* Payment method placeholders */}
      <div className='flex flex-col gap-3'>
        <button className='flex cursor-pointer items-center gap-3 rounded-lg border border-[#ddd] bg-white p-4 text-left text-sm font-medium text-[#333] transition-colors duration-150 hover:border-[#c0392b]'>
          <svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='#333' strokeWidth='2'>
            <rect x='1' y='4' width='22' height='16' rx='2' ry='2' />
            <line x1='1' y1='10' x2='23' y2='10' />
          </svg>
          {t('donation_widget.payment.bank_transfer')}
        </button>
        <button className='flex cursor-pointer items-center gap-3 rounded-lg border border-[#ddd] bg-white p-4 text-left text-sm font-medium text-[#333] transition-colors duration-150 hover:border-[#c0392b]'>
          <svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='#333' strokeWidth='2'>
            <circle cx='12' cy='12' r='10' />
            <path d='M12 6v6l4 2' />
          </svg>
          {t('donation_widget.payment.crypto_transfer')}
        </button>
      </div>

      {/* Navigation */}
      <div className='flex gap-3'>
        <button
          onClick={onBack}
          className='flex-1 cursor-pointer rounded-lg border border-[#ddd] bg-white py-3 text-sm font-medium text-[#333] transition-colors duration-150 hover:border-[#c0392b]'
        >
          {t('donation_widget.back')}
        </button>
        <button
          onClick={onNext}
          className='flex-1 cursor-pointer rounded-lg border-none bg-linear-to-br from-[#c0392b] to-[#e74c3c] py-3 text-sm font-semibold text-white transition-opacity duration-200'
        >
          {t('donation_widget.continue')}
        </button>
      </div>
    </div>
  );
};

export default PaymentStep;
