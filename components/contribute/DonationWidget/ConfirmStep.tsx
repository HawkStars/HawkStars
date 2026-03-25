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
      <p className='text-center text-[15px] leading-relaxed text-[#333]'>
        {t('donation_widget.confirm.description')}
      </p>

      {/* Summary */}
      <div className='rounded-lg border border-[#ddd] bg-[#fafafa] p-4'>
        <div className='flex items-center justify-between border-b border-[#eee] pb-3'>
          <span className='text-sm text-[#555]'>{t('donation_widget.confirm.amount_label')}</span>
          <span className='text-base font-semibold text-[#333]'>&euro;{activeAmount}</span>
        </div>
        <div className='flex items-center justify-between border-b border-[#eee] py-3'>
          <span className='text-sm text-[#555]'>
            {t('donation_widget.confirm.frequency_label')}
          </span>
          <span className='text-sm font-medium text-[#333] capitalize'>
            {donationState.frequency === 'monthly'
              ? t('donation_widget.confirm.frequency_monthly')
              : t('donation_widget.confirm.frequency_one_time')}
          </span>
        </div>
        <div className='flex items-center justify-between border-b border-[#eee] py-3'>
          <span className='text-sm text-[#555]'>{t('donation_widget.confirm.name_label')}</span>
          <span className='text-sm font-medium text-[#333]'>{donationState.name}</span>
        </div>
        <div className='flex items-center justify-between border-b border-[#eee] py-3'>
          <span className='text-sm text-[#555]'>{t('donation_widget.confirm.email_label')}</span>
          <span className='text-sm font-medium text-[#333]'>{donationState.email}</span>
        </div>
        {donationState.paymentMethod && (
          <div className='flex items-center justify-between border-b border-[#eee] py-3'>
            <span className='text-sm text-[#555]'>
              {t('donation_widget.confirm.payment_method_label')}
            </span>
            <span className='text-sm font-medium text-[#333]'>
              {t(PAYMENT_METHOD_LABELS[donationState.paymentMethod] || donationState.paymentMethod)}
            </span>
          </div>
        )}
        {donationState.comment && (
          <div className='flex flex-col gap-1 pt-3'>
            <span className='text-sm text-[#555]'>
              {t('donation_widget.confirm.comment_label')}
            </span>
            <span className='text-sm text-[#333]'>{donationState.comment}</span>
          </div>
        )}
      </div>

      {/* Error message */}
      {submitError && (
        <div className='rounded-lg border border-red-200 bg-red-50 p-3 text-center text-sm text-red-600'>
          {submitError}
        </div>
      )}

      {/* Navigation */}
      <div className='flex gap-3'>
        <button
          onClick={onBack}
          disabled={isSubmitting}
          className='flex-1 cursor-pointer rounded-lg border border-[#ddd] bg-white py-3 text-sm font-medium text-[#333] transition-colors duration-150 hover:border-[#c0392b] disabled:cursor-not-allowed disabled:opacity-50'
        >
          {t('donation_widget.back')}
        </button>
        <button
          onClick={onConfirm}
          disabled={isSubmitting}
          className='flex-1 cursor-pointer rounded-lg border-none bg-linear-to-br from-[#c0392b] to-[#e74c3c] py-3 text-sm font-semibold text-white transition-opacity duration-200 disabled:cursor-not-allowed disabled:opacity-50'
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
