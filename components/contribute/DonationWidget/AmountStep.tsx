import { cn } from '@/lib/utils';
import { DonationType, PRESET_AMOUNTS, getActiveAmount, DonationState } from './types';

type AmountStepProps = {
  frequency: DonationType;
  selectedAmount: number | null;
  customAmount: string;
  onFrequencyChange: (frequency: DonationType) => void;
  onPresetClick: (amount: number) => void;
  onCustomAmountChange: (value: string) => void;
};

const AmountStep = ({
  frequency,
  selectedAmount,
  customAmount,
  onFrequencyChange,
  onPresetClick,
  onCustomAmountChange,
}: AmountStepProps) => {
  const activeAmount = getActiveAmount({ frequency, selectedAmount, customAmount, comment: '' });

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9.]/g, '');
    onCustomAmountChange(val);
  };

  return (
    <div className='flex flex-col'>
      {/* Description */}
      <p className='mb-6 text-center text-[15px] leading-relaxed text-[#333]'>
        Your donation to <strong>HawkStars</strong> is crucial in supporting our mission to promote
        art, culture, and community projects. Every contribution makes a difference. Thank you for
        your generosity.
      </p>

      {/* Frequency Toggle */}
      <div className='mx-auto mb-5 flex w-fit overflow-hidden rounded-md border border-[#c0392b]'>
        <button
          onClick={() => onFrequencyChange('one-time')}
          className={cn(
            'cursor-pointer border-none px-6 py-2 text-sm font-medium transition-all duration-200',
            frequency === 'one-time' ? 'bg-[#c0392b] text-white' : 'bg-white text-[#c0392b]'
          )}
        >
          One-time
        </button>
        <button
          onClick={() => onFrequencyChange('monthly')}
          className={cn(
            'cursor-pointer border-none px-6 py-2 text-sm font-medium transition-all duration-200',
            frequency === 'monthly' ? 'bg-[#c0392b] text-white' : 'bg-white text-[#c0392b]'
          )}
        >
          Monthly
        </button>
      </div>

      {/* Preset Amounts */}
      <div className='mb-3 grid grid-cols-3 gap-2.5'>
        {PRESET_AMOUNTS.map((amount) => (
          <button
            key={amount}
            onClick={() => onPresetClick(amount)}
            className={cn(
              'cursor-pointer rounded-lg py-3.5 text-base font-medium transition-all duration-150',
              selectedAmount === amount
                ? 'border-2 border-[#c0392b] bg-[#c0392b] text-white'
                : 'border border-[#ddd] bg-white text-[#333] hover:border-[#c0392b]'
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
          placeholder='Custom Amount'
          value={customAmount}
          onChange={handleCustomChange}
          className='w-full rounded-lg border border-[#ddd] py-3.5 pr-3.5 pl-8 text-base text-[#333] transition-colors duration-150 outline-none focus:border-[#c0392b]'
          aria-label='Custom donation amount'
        />
      </div>

      {/* Donate Button */}
      <button
        className={cn(
          'w-full rounded-lg border-none bg-gradient-to-br from-[#c0392b] to-[#e74c3c] py-4 text-base font-semibold text-white transition-[opacity,transform] duration-200',
          activeAmount && activeAmount > 0
            ? 'cursor-pointer opacity-100'
            : 'cursor-not-allowed opacity-50'
        )}
        disabled={!activeAmount || activeAmount <= 0}
      >
        Donate{activeAmount ? ` \u20AC${activeAmount}` : ''}
        {frequency === 'monthly' ? ' / month' : ''}
      </button>
    </div>
  );
};

export default AmountStep;
