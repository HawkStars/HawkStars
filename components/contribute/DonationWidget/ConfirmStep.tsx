import { DonationState, getActiveAmount } from './types';
import { Button } from '@/components/ui/button';
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
      <div className='border-bege-dark bg-bege-light rounded-lg border p-4'>
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
        <Button
          type='button'
          variant='outline'
          size='lg'
          className='flex-1'
          onClick={onBack}
          disabled={isSubmitting}
        >
          {t('donation_widget.back')}
        </Button>
        <Button
          type='button'
          size='lg'
          className='flex-1'
          onClick={onConfirm}
          disabled={isSubmitting}
        >
          {isSubmitting
            ? t('donation_widget.confirm.processing')
            : t('donation_widget.confirm.confirm_button')}
        </Button>
      </div>
    </div>
  );
};

export default ConfirmStep;
