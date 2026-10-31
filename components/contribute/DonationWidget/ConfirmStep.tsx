import { DonationState, getActiveAmount } from './types';
import { useTranslation } from '@/i18n/client';
import { useLanguageCookie } from '@/utils/contexts/AppProvider';

type ConfirmStepProps = {
  donationState: DonationState;
  isSubmitting: boolean;
  submitError: string | null;
  onBack: () => void;
  onConfirm: () => void;
};

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  CC: 'donation_widget.payment.credit_card',
  MB: 'donation_widget.payment.multibanco',
  MBW: 'donation_widget.payment.mbway',
};

const ConfirmStep = ({
  donationState,
  isSubmitting,
  submitError,
  onBack,
  onConfirm,
}: ConfirmStepProps) => {
  const lng = useLanguageCookie();
  const { t } = useTranslation(lng, 'contribute');
  const activeAmount = getActiveAmount(donationState);

  return (
    <div className='flex flex-col gap-5'>
      <p className='text-center text-[15px] leading-relaxed text-neutral-800'>
        {t('donation_widget.confirm.description')}
      </p>

      {/* Summary */}
      <div className='rounded-lg border border-neutral-300 bg-neutral-50 p-4'>
        <div className='flex items-center justify-between border-b border-neutral-200 pb-3'>
          <span className='text-sm text-neutral-600'>
            {t('donation_widget.confirm.amount_label')}
          </span>
          <span className='text-base font-semibold text-neutral-800'>&euro;{activeAmount}</span>
        </div>
        <div className='flex items-center justify-between border-b border-neutral-200 py-3'>
          <span className='text-sm text-neutral-600'>
            {t('donation_widget.confirm.frequency_label')}
          </span>
          <span className='text-sm font-medium text-neutral-800 capitalize'>
            {donationState.frequency === 'monthly'
              ? t('donation_widget.confirm.frequency_monthly')
              : t('donation_widget.confirm.frequency_one_time')}
          </span>
        </div>
        <div className='flex items-center justify-between border-b border-neutral-200 py-3'>
          <span className='text-sm text-neutral-600'>
            {t('donation_widget.confirm.name_label')}
          </span>
          <span className='text-sm font-medium text-neutral-800'>{donationState.name}</span>
        </div>
        <div className='flex items-center justify-between border-b border-neutral-200 py-3'>
          <span className='text-sm text-neutral-600'>
            {t('donation_widget.confirm.email_label')}
          </span>
          <span className='text-sm font-medium text-neutral-800'>{donationState.email}</span>
        </div>
        {donationState.paymentMethod && (
          <div className='flex items-center justify-between border-b border-neutral-200 py-3'>
            <span className='text-sm text-neutral-600'>
              {t('donation_widget.confirm.payment_method_label')}
            </span>
            <span className='text-sm font-medium text-neutral-800'>
              {t(PAYMENT_METHOD_LABELS[donationState.paymentMethod] || donationState.paymentMethod)}
            </span>
          </div>
        )}
        {donationState.comment && (
          <div className='flex flex-col gap-1 pt-3'>
            <span className='text-sm text-neutral-600'>
              {t('donation_widget.confirm.comment_label')}
            </span>
            <span className='text-sm text-neutral-800'>{donationState.comment}</span>
          </div>
        )}
      </div>

      {/* Error message */}
      {submitError && (
        <div
          className='rounded-lg border border-red-200 bg-red-50 p-3 text-center text-sm text-red-700'
          role='alert'
        >
          {submitError}
        </div>
      )}

      {/* Navigation */}
      <div className='flex gap-3'>
        <button
          onClick={onBack}
          disabled={isSubmitting}
          className='hover:border-green flex-1 cursor-pointer rounded-lg border border-neutral-300 bg-white py-3 text-sm font-medium text-neutral-800 transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50'
        >
          {t('donation_widget.back')}
        </button>
        <button
          onClick={onConfirm}
          disabled={isSubmitting}
          className='from-green-dark to-green flex-1 cursor-pointer rounded-lg border-none bg-linear-to-br py-3 text-sm font-semibold text-white transition-opacity duration-200 disabled:cursor-not-allowed disabled:opacity-50'
        >
          {isSubmitting
            ? t('donation_widget.confirm.processing')
            : t('donation_widget.confirm.confirm_button')}
        </button>
      </div>
    </div>
  );
};

export default ConfirmStep;
