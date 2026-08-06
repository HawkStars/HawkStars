import { useState } from 'react';
import { useTranslation } from '@/i18n/client';
import { useLanguageCookie } from '@/utils/contexts/AppProvider';

type DetailsStepProps = {
  name: string;
  email: string;
  phoneNumber: string;
  phoneIndicative: string;
  comment: string;
  onNameChange: (name: string) => void;
  onEmailChange: (email: string) => void;
  onPhoneNumberChange: (phone: string) => void;
  onPhoneIndicativeChange: (indicative: string) => void;
  onCommentChange: (comment: string) => void;
  onBack: () => void;
  onNext: () => void;
};

const DetailsStep = ({
  name,
  email,
  phoneNumber,
  phoneIndicative,
  comment,
  onNameChange,
  onEmailChange,
  onPhoneNumberChange,
  onPhoneIndicativeChange,
  onCommentChange,
  onBack,
  onNext,
}: DetailsStepProps) => {
  const lng = useLanguageCookie();
  const { t } = useTranslation(lng, 'contribute');
  const [showComment, setShowComment] = useState(!!comment);

  const isValid = name.trim().length > 0 && email.trim().length > 0 && email.includes('@');

  const handleNext = () => {
    if (isValid) onNext();
  };

  return (
    <div className='flex flex-col gap-4'>
      <p className='text-center text-[15px] leading-relaxed text-[#333]'>
        {t('donation_widget.details.description')}
      </p>

      {/* Name */}
      <div>
        <label htmlFor='donation-name' className='mb-1 block text-sm font-medium text-[#555]'>
          {t('donation_widget.details.name_label')} <span aria-hidden='true'>*</span>
        </label>
        <input
          id='donation-name'
          type='text'
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder={t('donation_widget.details.name_placeholder')}
          className='w-full rounded-lg border border-[#ddd] px-3 py-2.5 text-sm text-[#333] outline-hidden focus-visible:border-[#c0392b] focus-visible:ring-2 focus-visible:ring-[#c0392b] focus-visible:ring-offset-1'
          required
          aria-required='true'
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor='donation-email' className='mb-1 block text-sm font-medium text-[#555]'>
          {t('donation_widget.details.email_label')} <span aria-hidden='true'>*</span>
        </label>
        <input
          id='donation-email'
          type='email'
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          placeholder={t('donation_widget.details.email_placeholder')}
          className='w-full rounded-lg border border-[#ddd] px-3 py-2.5 text-sm text-[#333] outline-hidden focus-visible:border-[#c0392b] focus-visible:ring-2 focus-visible:ring-[#c0392b] focus-visible:ring-offset-1'
          required
          aria-required='true'
        />
      </div>

      {/* Phone */}
      <fieldset className='border-0 p-0'>
        <legend className='mb-1 block text-sm font-medium text-[#555]'>
          {t('donation_widget.details.phone_label')}
        </legend>
        <div className='flex gap-2'>
          <input
            id='donation-phone-indicative'
            type='text'
            value={phoneIndicative}
            onChange={(e) => onPhoneIndicativeChange(e.target.value)}
            className='w-20 rounded-lg border border-[#ddd] px-3 py-2.5 text-center text-sm text-[#333] outline-hidden focus-visible:border-[#c0392b] focus-visible:ring-2 focus-visible:ring-[#c0392b] focus-visible:ring-offset-1'
            placeholder='+351'
            aria-label={t('donation_widget.details.phone_indicative_label')}
          />
          <input
            id='donation-phone-number'
            type='tel'
            value={phoneNumber}
            onChange={(e) => onPhoneNumberChange(e.target.value.replace(/[^0-9]/g, ''))}
            placeholder={t('donation_widget.details.phone_placeholder')}
            className='flex-1 rounded-lg border border-[#ddd] px-3 py-2.5 text-sm text-[#333] outline-hidden focus-visible:border-[#c0392b] focus-visible:ring-2 focus-visible:ring-[#c0392b] focus-visible:ring-offset-1'
            aria-label={t('donation_widget.details.phone_label')}
          />
        </div>
      </fieldset>

      {/* Comment Toggle */}
      <div>
        <label className='flex cursor-pointer items-center gap-2' htmlFor='donation-show-comment'>
          <input
            id='donation-show-comment'
            type='checkbox'
            checked={showComment}
            onChange={(e) => {
              setShowComment(e.target.checked);
              if (!e.target.checked) onCommentChange('');
            }}
            className='h-4 w-4 cursor-pointer accent-[#c0392b]'
          />
          <span className='text-sm text-[#555]'>{t('donation_widget.details.write_comment')}</span>
        </label>
        {showComment && (
          <>
            <label htmlFor='donation-comment' className='sr-only'>
              {t('donation_widget.details.comment_placeholder')}
            </label>
            <textarea
              id='donation-comment'
              value={comment}
              onChange={(e) => onCommentChange(e.target.value)}
              placeholder={t('donation_widget.details.comment_placeholder')}
              rows={3}
              style={{ resize: 'vertical' }}
              className='mt-2.5 w-full rounded-lg border border-[#ddd] px-3 py-2.5 font-[inherit] text-sm outline-hidden focus-visible:border-[#c0392b] focus-visible:ring-2 focus-visible:ring-[#c0392b] focus-visible:ring-offset-1'
            />
          </>
        )}
      </div>

      {/* Navigation */}
      <div className='flex gap-3'>
        <button
          type='button'
          onClick={onBack}
          className='flex-1 cursor-pointer rounded-lg border border-[#ddd] bg-white py-3 text-sm font-medium text-[#333] transition-colors duration-150 hover:border-[#c0392b] focus-visible:ring-2 focus-visible:ring-[#c0392b] focus-visible:ring-offset-2'
        >
          {t('donation_widget.back')}
        </button>
        <button
          type='button'
          onClick={handleNext}
          disabled={!isValid}
          className='flex-1 cursor-pointer rounded-lg border-none bg-linear-to-br from-[#c0392b] to-[#e74c3c] py-3 text-sm font-semibold text-white transition-opacity duration-200 focus-visible:ring-2 focus-visible:ring-[#c0392b] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
        >
          {t('donation_widget.continue')}
        </button>
      </div>
    </div>
  );
};

export default DetailsStep;
