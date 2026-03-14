import { DonationState, getActiveAmount } from './types';

type DoneStepProps = {
  donationState: DonationState;
  onReset: () => void;
};

const DoneStep = ({ donationState, onReset }: DoneStepProps) => {
  const activeAmount = getActiveAmount(donationState);

  return (
    <div className='flex flex-col items-center gap-5 py-4'>
      {/* Success icon */}
      <div className='flex h-16 w-16 items-center justify-center rounded-full bg-[#27ae60]'>
        <svg
          width='32'
          height='32'
          viewBox='0 0 24 24'
          fill='none'
          stroke='white'
          strokeWidth='2.5'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <polyline points='20 6 9 17 4 12' />
        </svg>
      </div>

      <h3 className='text-xl font-semibold text-[#333]'>Thank you!</h3>
      <p className='text-center text-[15px] leading-relaxed text-[#555]'>
        Your &euro;{activeAmount}
        {donationState.frequency === 'monthly' ? '/month' : ''} donation to HawkStars has been
        registered. Together we make a difference.
      </p>

      <button
        onClick={onReset}
        className='mt-2 cursor-pointer rounded-lg border border-[#c0392b] bg-white px-8 py-3 text-sm font-medium text-[#c0392b] transition-colors duration-150 hover:bg-[#c0392b] hover:text-white'
      >
        Make another donation
      </button>
    </div>
  );
};

export default DoneStep;
