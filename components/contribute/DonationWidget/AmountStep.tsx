import { cn } from '@/lib/utils';
import { DonationType, PRESET_AMOUNTS } from './types';
import { useState } from 'react';
import { useTranslation } from '@/i18n/client';
import { useLanguageCookie } from '@/utils/contexts/AppProvider';

type AmountStepProps = {
  frequency: DonationType;
  selectedAmount: number | null;
  onFrequencyChange: (frequency: DonationType) => void;
  onHandleDonationValue: (amount: number) => void;
};

const AmountStep = ({ frequency, onFrequencyChange, onHandleDonationValue }: AmountStepProps) => {
  const lng = useLanguageCookie();
  const { t } = useTranslation(lng, 'contribute');
  const [customAmount, setCustomAmount] = useState<number | null>(null);

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9.]/g, '');
    setCustomAmount(val ? parseFloat(val) : null);
  };

  const handleDonateButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!customAmount) return;

    if (customAmount && customAmount > 0) {
      onHandleDonationValue(customAmount);
    }
  };

  return (
    <div className='flex flex-col'>
      {/* Description */}
      <p
        className='mb-6 text-center text-[15px] leading-relaxed text-[#333]'
        dangerouslySetInnerHTML={{ __html: t('donation_widget.amount.description') }}
      />

      {/* Frequency Toggle */}
      <div className='bg-green border-green mx-auto mb-5 flex w-fit overflow-hidden rounded-md border'>
        <button
          onClick={() => onFrequencyChange('one-time')}
          className={cn(
            'cursor-pointer border-none px-6 py-2 text-sm font-medium transition-all duration-200',
            frequency === 'one-time' ? 'bg-green text-white' : 'text-green bg-white'
          )}
        >
          {t('donation_widget.amount.one_time')}
        </button>
        <button
          onClick={() => onFrequencyChange('monthly')}
          className={cn(
            'cursor-pointer border-none px-6 py-2 text-sm font-medium transition-all duration-200',
            frequency === 'monthly' ? 'bg-green text-white' : 'text-green bg-white'
          )}
        >
          {t('donation_widget.amount.monthly')}
        </button>
      </div>

      {/* Preset Amounts */}
      <div className='mb-3 grid grid-cols-3 gap-2.5'>
        {PRESET_AMOUNTS.map((amount) => (
          <button
            key={amount}
            onClick={() => setCustomAmount(amount)}
            className={cn(
              'cursor-pointer rounded-lg py-3.5 text-base font-medium transition-all duration-150',
              customAmount === amount
                ? 'border-green bg-green border-2 text-white'
                : 'hover:border-green border border-[#ddd] bg-white text-[#333]'
            )}
          >
            &euro;{amount}
          </button>
        ))}
      </div>

      {/* Custom Amount */}
      <div className='relative mb-4'>
        <span className='absolute top-1/2 left-3.5 -translate-y-1/2 text-base font-medium text-[#999]'>
          &euro;
        </span>
        <input
          type='text'
          placeholder={t('donation_widget.amount.custom_amount')}
          value={customAmount ?? ''}
          onChange={handleCustomChange}
          className='w-full rounded-lg border border-[#ddd] py-3.5 pr-3.5 pl-8 text-base text-[#333] transition-colors duration-150 outline-none focus:border-[#c0392b]'
          aria-label='Custom donation amount'
        />
      </div>

      {/* Donate Button */}
      <button
        className={cn(
          'bg-green w-full rounded-lg border-none py-4 text-base font-semibold text-white transition-[opacity,transform] duration-200',
          customAmount && customAmount > 0
            ? 'cursor-pointer opacity-100'
            : 'cursor-not-allowed opacity-50'
        )}
        onClick={handleDonateButton}
        disabled={!customAmount || customAmount <= 0}
      >
        {t('donation_widget.amount.donate')}
        {customAmount ? ` \u20AC${customAmount}` : ''}
        {frequency === 'monthly' ? ` ${t('donation_widget.amount.per_month')}` : ''}
      </button>
    </div>
  );
};

export default AmountStep;
