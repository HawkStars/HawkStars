import { cn } from '@/lib/utils';
import { STEPS } from './types';

type DonationHeaderProps = {
  title: string;
  currentStep: number;
  canAdvance: boolean;
  onNextStep: () => void;
};

const DonationHeader = ({ title, currentStep, canAdvance, onNextStep }: DonationHeaderProps) => {
  return (
    <div className='bg-green flex items-center justify-between px-5 py-4.5'>
      <h2 className='m-0 text-lg font-semibold text-white'>{title}</h2>
      <div className='flex items-center gap-1.5'>
        <span className='mr-1 flex items-center'>
          <svg
            width='14'
            height='14'
            viewBox='0 0 24 24'
            fill='none'
            stroke='white'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <rect x='3' y='11' width='18' height='11' rx='2' ry='2' />
            <path d='M7 11V7a5 5 0 0 1 10 0v4' />
          </svg>
        </span>
        {STEPS.map((step, i) => (
          <span
            key={step.id}
            className={cn(
              'inline-block h-2.5 w-2.5 rounded-full transition-colors duration-200',
              i < currentStep ? 'bg-white' : 'bg-white/40'
            )}
          />
        ))}
        <button
          className='ml-1 flex cursor-pointer items-center border-none bg-transparent p-0.5 disabled:cursor-not-allowed disabled:opacity-50'
          onClick={onNextStep}
          disabled={!canAdvance}
          aria-label='Next step'
        >
          <svg
            width='20'
            height='20'
            viewBox='0 0 24 24'
            fill='none'
            stroke='white'
            strokeWidth='2.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <polyline points='9 18 15 12 9 6' />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default DonationHeader;
