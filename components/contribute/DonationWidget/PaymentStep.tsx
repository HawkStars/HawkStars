import { cn } from '@/lib/utils';
import { DonationType, PaymentMethodOption } from './types';
import { useTranslation } from '@/i18n/client';
import { useLanguageCookie } from '@/utils/contexts/AppProvider';

type PaymentStepProps = {
  frequency: DonationType;
  selectedMethod: PaymentMethodOption | null;
  onSelectMethod: (method: PaymentMethodOption) => void;
  onBack: () => void;
  onNext: () => void;
};

type MethodConfig = {
  id: PaymentMethodOption;
  labelKey: string;
  icon: React.ReactNode;
  subscriptionOnly?: boolean;
};

const CreditCardIcon = (
  <svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
    <rect x='1' y='4' width='22' height='16' rx='2' ry='2' />
    <line x1='1' y1='10' x2='23' y2='10' />
  </svg>
);

const MultibancoIcon = (
  <svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
    <rect x='2' y='3' width='20' height='18' rx='2' />
    <line x1='8' y1='9' x2='16' y2='9' />
    <line x1='8' y1='13' x2='16' y2='13' />
    <line x1='8' y1='17' x2='12' y2='17' />
  </svg>
);

const MBWayIcon = (
  <svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
    <rect x='5' y='2' width='14' height='20' rx='2' ry='2' />
    <line x1='12' y1='18' x2='12.01' y2='18' />
  </svg>
);

const PAYMENT_METHODS: MethodConfig[] = [
  { id: 'CC', labelKey: 'donation_widget.payment.credit_card', icon: CreditCardIcon },
  { id: 'MB', labelKey: 'donation_widget.payment.multibanco', icon: MultibancoIcon },
  { id: 'MBW', labelKey: 'donation_widget.payment.mbway', icon: MBWayIcon },
];

const PaymentStep = ({
  frequency,
  selectedMethod,
  onSelectMethod,
  onBack,
  onNext,
}: PaymentStepProps) => {
  const lng = useLanguageCookie();
  const { t } = useTranslation(lng, 'contribute');

  // Subscriptions only support Credit Card (CC) via EasyPay
  const isSubscription = frequency === 'monthly';
  const availableMethods = isSubscription
    ? PAYMENT_METHODS.filter((m) => m.id === 'CC')
    : PAYMENT_METHODS;

  const handleSelectAndContinue = (method: PaymentMethodOption) => {
    onSelectMethod(method);
  };

  const handleNext = () => {
    if (selectedMethod) onNext();
  };

  return (
    <div className='flex flex-col gap-5'>
      <p className='text-center text-[15px] leading-relaxed text-[#333]'>
        {t('donation_widget.payment.description')}
      </p>

      {isSubscription && (
        <p className='text-center text-xs text-[#888]'>
          {t('donation_widget.payment.subscription_note')}
        </p>
      )}

      {/* Payment methods */}
      <div className='flex flex-col gap-3'>
        {availableMethods.map((method) => (
          <button
            key={method.id}
            onClick={() => handleSelectAndContinue(method.id)}
            className={cn(
              'flex cursor-pointer items-center gap-3 rounded-lg border bg-white p-4 text-left text-sm font-medium text-[#333] transition-colors duration-150',
              selectedMethod === method.id
                ? 'border-green bg-green/5'
                : 'border-[#ddd] hover:border-[#c0392b]'
            )}
          >
            <span className='text-[#555]'>{method.icon}</span>
            {t(method.labelKey)}
            {selectedMethod === method.id && (
              <svg
                className='text-green ml-auto'
                width='18'
                height='18'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2.5'
              >
                <polyline points='20 6 9 17 4 12' />
              </svg>
            )}
          </button>
        ))}
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
          onClick={handleNext}
          disabled={!selectedMethod}
          className='flex-1 cursor-pointer rounded-lg border-none bg-linear-to-br from-[#c0392b] to-[#e74c3c] py-3 text-sm font-semibold text-white transition-opacity duration-200 disabled:cursor-not-allowed disabled:opacity-50'
        >
          {t('donation_widget.continue')}
        </button>
      </div>
    </div>
  );
};

export default PaymentStep;
