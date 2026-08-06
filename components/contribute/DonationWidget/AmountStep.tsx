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

const FREQUENCIES: DonationType[] = ['one-time', 'monthly'];

type PresetAmount = (typeof PRESET_AMOUNTS)[number];

const moveRadioSelection = <T,>(
  event: React.KeyboardEvent<HTMLButtonElement>,
  options: readonly T[],
  current: T | null,
  onSelect: (value: T) => void
) => {
  if (!['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'].includes(event.key)) return;
  event.preventDefault();

  const currentIndex = current === null ? -1 : options.indexOf(current);
  const forward = event.key === 'ArrowRight' || event.key === 'ArrowDown';
  const nextIndex =
    currentIndex === -1
      ? forward
        ? 0
        : options.length - 1
      : (currentIndex + (forward ? 1 : -1) + options.length) % options.length;

  onSelect(options[nextIndex]);

  const group = event.currentTarget.closest('[role="radiogroup"]');
  group?.querySelectorAll<HTMLButtonElement>('[role="radio"]')[nextIndex]?.focus();
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

  // A preset is "checked" only when the current amount exactly matches it; a
  // freely typed custom amount leaves the whole group unchecked.
  const selectedPreset =
    customAmount !== null && (PRESET_AMOUNTS as readonly number[]).includes(customAmount)
      ? (customAmount as PresetAmount)
      : null;

  return (
    <div className='flex flex-col'>
      {/* Description */}
      <p
        className='mb-6 text-center text-[15px] leading-relaxed text-[#333]'
        dangerouslySetInnerHTML={{ __html: t('donation_widget.amount.description') }}
      />

      {/* Frequency Toggle */}
      <div
        role='radiogroup'
        aria-label={t('donation_widget.amount.frequency_legend')}
        className='bg-green border-green mx-auto mb-5 flex w-fit overflow-hidden rounded-md border'
      >
        {FREQUENCIES.map((option) => {
          const isSelected = frequency === option;
          return (
            <button
              key={option}
              type='button'
              role='radio'
              aria-checked={isSelected}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => onFrequencyChange(option)}
              onKeyDown={(e) => moveRadioSelection(e, FREQUENCIES, frequency, onFrequencyChange)}
              className={cn(
                'cursor-pointer border-none px-6 py-2 text-sm font-medium transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#c0392b] focus-visible:ring-offset-2 focus-visible:outline-hidden',
                isSelected ? 'bg-green text-white' : 'text-green bg-white'
              )}
            >
              {t(
                option === 'one-time'
                  ? 'donation_widget.amount.one_time'
                  : 'donation_widget.amount.monthly'
              )}
            </button>
          );
        })}
      </div>

      {/* Preset Amounts */}
      <div
        role='radiogroup'
        aria-label={t('donation_widget.amount.preset_legend')}
        className='mb-3 grid grid-cols-3 gap-2.5'
      >
        {PRESET_AMOUNTS.map((amount, index) => {
          const isSelected = selectedPreset === amount;
          // With no preset selected, keep the first option reachable by Tab.
          const isTabStop = selectedPreset === null ? index === 0 : isSelected;
          return (
            <button
              key={amount}
              type='button'
              role='radio'
              aria-checked={isSelected}
              tabIndex={isTabStop ? 0 : -1}
              onClick={() => setCustomAmount(amount)}
              onKeyDown={(e) =>
                moveRadioSelection(e, PRESET_AMOUNTS, selectedPreset, setCustomAmount)
              }
              className={cn(
                'cursor-pointer rounded-lg py-3.5 text-base font-medium transition-all duration-150 focus-visible:ring-2 focus-visible:ring-[#c0392b] focus-visible:ring-offset-2 focus-visible:outline-hidden',
                isSelected
                  ? 'border-green bg-green border-2 text-white'
                  : 'hover:border-green border border-[#ddd] bg-white text-[#333]'
              )}
            >
              &euro;{amount}
            </button>
          );
        })}
      </div>

      {/* Custom Amount */}
      <div className='relative mb-4'>
        {/* A11Y-M5: was text-[#999] (2.85:1 on white) — now ~7:1. */}
        <span
          aria-hidden='true'
          className='absolute top-1/2 left-3.5 -translate-y-1/2 text-base font-medium text-[#595959]'
        >
          &euro;
        </span>
        <input
          type='text'
          placeholder={t('donation_widget.amount.custom_amount')}
          value={customAmount ?? ''}
          onChange={handleCustomChange}
          className='w-full rounded-lg border border-[#ddd] py-3.5 pr-3.5 pl-8 text-base text-[#333] outline-hidden transition-colors duration-150 focus-visible:border-[#c0392b] focus-visible:ring-2 focus-visible:ring-[#c0392b] focus-visible:ring-offset-1'
          aria-label={t('donation.custom_amount')}
        />
      </div>

      {/* Donate Button */}
      <button
        type='button'
        className={cn(
          'bg-green w-full rounded-lg border-none py-4 text-base font-semibold text-white transition-[opacity,transform] duration-200 focus-visible:ring-2 focus-visible:ring-[#c0392b] focus-visible:ring-offset-2 focus-visible:outline-hidden',
          customAmount && customAmount > 0
            ? 'cursor-pointer opacity-100'
            : 'cursor-not-allowed opacity-50'
        )}
        onClick={handleDonateButton}
        disabled={!customAmount || customAmount <= 0}
      >
        {t('donation_widget.amount.donate')}
        {customAmount ? ` €${customAmount}` : ''}
        {frequency === 'monthly' ? ` ${t('donation_widget.amount.per_month')}` : ''}
      </button>
    </div>
  );
};

export default AmountStep;
