import { DonationState, getActiveAmount } from './types';

type ConfirmStepProps = {
  donationState: DonationState;
  onBack: () => void;
  onConfirm: () => void;
};

const ConfirmStep = ({ donationState, onBack, onConfirm }: ConfirmStepProps) => {
  const activeAmount = getActiveAmount(donationState);

  return (
    <div className='flex flex-col gap-5'>
      <p className='text-center text-[15px] leading-relaxed text-[#333]'>
        Please review your donation details.
      </p>

      {/* Summary */}
      <div className='rounded-lg border border-[#ddd] bg-[#fafafa] p-4'>
        <div className='flex items-center justify-between border-b border-[#eee] pb-3'>
          <span className='text-sm text-[#555]'>Amount</span>
          <span className='text-base font-semibold text-[#333]'>
            &euro;{activeAmount}
          </span>
        </div>
        <div className='flex items-center justify-between border-b border-[#eee] py-3'>
          <span className='text-sm text-[#555]'>Frequency</span>
          <span className='text-sm font-medium capitalize text-[#333]'>
            {donationState.frequency === 'monthly' ? 'Monthly' : 'One-time'}
          </span>
        </div>
        {donationState.comment && (
          <div className='flex flex-col gap-1 pt-3'>
            <span className='text-sm text-[#555]'>Comment</span>
            <span className='text-sm text-[#333]'>{donationState.comment}</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className='flex gap-3'>
        <button
          onClick={onBack}
          className='flex-1 cursor-pointer rounded-lg border border-[#ddd] bg-white py-3 text-sm font-medium text-[#333] transition-colors duration-150 hover:border-[#c0392b]'
        >
          Back
        </button>
        <button
          onClick={onConfirm}
          className='flex-1 cursor-pointer rounded-lg border-none bg-gradient-to-br from-[#c0392b] to-[#e74c3c] py-3 text-sm font-semibold text-white transition-opacity duration-200'
        >
          Confirm Donation
        </button>
      </div>
    </div>
  );
};

export default ConfirmStep;
