import { DonationState, getActiveAmount } from './types';
import { useTranslation } from '@/i18n/client';
import { useLanguageCookie } from '@/utils/contexts/AppProvider';

type DoneStepProps = {
  donationState: DonationState;
  paymentResponse: Record<string, unknown> | null;
  onReset: () => void;
};

const DoneStep = ({ donationState, paymentResponse, onReset }: DoneStepProps) => {
  const lng = useLanguageCookie();
  const { t } = useTranslation(lng, 'contribute');
  const activeAmount = getActiveAmount(donationState);

  // Extract MB reference info if available (for Multibanco payments)
  const mbEntity = paymentResponse?.method as Record<string, unknown> | undefined;
  const hasMBReference = mbEntity && 'entity' in mbEntity;

  return (
    <div className='flex flex-col items-center gap-5 py-4'>
      {/* Success icon */}
      <div className='bg-green flex h-16 w-16 items-center justify-center rounded-full'>
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

      <h3 className='text-h3_semibold text-neutral-800'>{t('donation_widget.done.title')}</h3>
      <p className='text-center text-[15px] leading-relaxed text-neutral-600'>
        {t('donation_widget.done.description', {
          amount: activeAmount,
          frequency:
            donationState.frequency === 'monthly' ? t('donation_widget.done.per_month') : '',
        })}
      </p>

      {/* Multibanco reference details */}
      {hasMBReference && (
        <div className='w-full rounded-lg border border-neutral-300 bg-neutral-50 p-4'>
          <p className='mb-2 text-center text-sm font-medium text-neutral-800'>
            {t('donation_widget.done.mb_reference_title')}
          </p>
          <div className='flex flex-col gap-1 text-center text-sm text-neutral-600'>
            <span>
              {t('donation_widget.done.mb_entity')}: {String(mbEntity.entity)}
            </span>
            <span>
              {t('donation_widget.done.mb_reference')}: {String(mbEntity.reference)}
            </span>
            <span>
              {t('donation_widget.done.mb_value')}: &euro;{activeAmount}
            </span>
          </div>
        </div>
      )}

      {donationState.frequency === 'monthly' && (
        <p className='text-center text-xs text-gray-700'>
          {t('donation_widget.done.subscription_note')}
        </p>
      )}

      <button
        onClick={onReset}
        className='border-green text-green hover:bg-green mt-2 cursor-pointer rounded-lg border bg-white px-8 py-3 text-sm font-medium transition-colors duration-150 hover:text-white'
      >
        {t('donation_widget.done.make_another')}
      </button>
    </div>
  );
};

export default DoneStep;
