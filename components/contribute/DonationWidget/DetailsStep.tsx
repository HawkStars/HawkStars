import { useRef, useState } from 'react';
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
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  // Validation used to gate a `disabled` Continue button and nothing else: a user who
  // mistyped their email got a permanently greyed-out button with no explanation, and
  // because `disabled` removes the button from the tab order a screen-reader user
  // never reached it to discover anything was wrong (WCAG 3.3.1, Level A).
  // The button now stays enabled and submitting surfaces the reason.
  const validate = () => {
    const next: { name?: string; email?: string } = {};

    if (name.trim().length === 0) next.name = t('donation_widget.details.name_required');

    if (email.trim().length === 0) next.email = t('donation_widget.details.email_required');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      next.email = t('donation_widget.details.email_invalid');

    return next;
  };

  const handleNext = () => {
    const next = validate();
    setErrors(next);

    if (next.name) {
      nameRef.current?.focus();
      return;
    }
    if (next.email) {
      emailRef.current?.focus();
      return;
    }

    onNext();
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
          ref={nameRef}
          id='donation-name'
          type='text'
          value={name}
          onChange={(e) => {
            onNameChange(e.target.value);
            if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
          }}
          placeholder={t('donation_widget.details.name_placeholder')}
          className='border-disabled w-full rounded-lg border px-3 py-2.5 text-sm text-[#333] outline-hidden focus-visible:border-[#c0392b] focus-visible:ring-2 focus-visible:ring-[#c0392b] focus-visible:ring-offset-1 aria-[invalid=true]:border-[#c0392b]'
          required
          aria-required='true'
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? 'donation-name-error' : undefined}
        />
        {errors.name && (
          <p id='donation-name-error' role='alert' className='mt-1 text-sm text-[#c0392b]'>
            {errors.name}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor='donation-email' className='mb-1 block text-sm font-medium text-[#555]'>
          {t('donation_widget.details.email_label')} <span aria-hidden='true'>*</span>
        </label>
        <input
          ref={emailRef}
          id='donation-email'
          type='email'
          value={email}
          onChange={(e) => {
            onEmailChange(e.target.value);
            if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
          }}
          placeholder={t('donation_widget.details.email_placeholder')}
          className='border-disabled w-full rounded-lg border px-3 py-2.5 text-sm text-[#333] outline-hidden focus-visible:border-[#c0392b] focus-visible:ring-2 focus-visible:ring-[#c0392b] focus-visible:ring-offset-1 aria-[invalid=true]:border-[#c0392b]'
          required
          aria-required='true'
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? 'donation-email-error' : undefined}
        />
        {errors.email && (
          <p id='donation-email-error' role='alert' className='mt-1 text-sm text-[#c0392b]'>
            {errors.email}
          </p>
        )}
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
            className='border-disabled w-20 rounded-lg border px-3 py-2.5 text-center text-sm text-[#333] outline-hidden focus-visible:border-[#c0392b] focus-visible:ring-2 focus-visible:ring-[#c0392b] focus-visible:ring-offset-1'
            placeholder='+351'
            aria-label={t('donation_widget.details.phone_indicative_label')}
          />
          <input
            id='donation-phone-number'
            type='tel'
            value={phoneNumber}
            onChange={(e) => onPhoneNumberChange(e.target.value.replace(/[^0-9]/g, ''))}
            placeholder={t('donation_widget.details.phone_placeholder')}
            className='border-disabled flex-1 rounded-lg border px-3 py-2.5 text-sm text-[#333] outline-hidden focus-visible:border-[#c0392b] focus-visible:ring-2 focus-visible:ring-[#c0392b] focus-visible:ring-offset-1'
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
              className='border-disabled mt-2.5 w-full rounded-lg border px-3 py-2.5 font-[inherit] text-sm outline-hidden focus-visible:border-[#c0392b] focus-visible:ring-2 focus-visible:ring-[#c0392b] focus-visible:ring-offset-1'
            />
          </>
        )}
      </div>

      {/* Navigation */}
      <div className='flex gap-3'>
        <button
          type='button'
          onClick={onBack}
          className='border-disabled flex-1 cursor-pointer rounded-lg border bg-white py-3 text-sm font-medium text-[#333] transition-colors duration-150 hover:border-[#c0392b] focus-visible:ring-2 focus-visible:ring-[#c0392b] focus-visible:ring-offset-2'
        >
          {t('donation_widget.back')}
        </button>
        <button
          type='button'
          onClick={handleNext}
          className='flex-1 cursor-pointer rounded-lg border-none bg-linear-to-br from-[#c0392b] to-[#e74c3c] py-3 text-sm font-semibold text-white transition-opacity duration-200 focus-visible:ring-2 focus-visible:ring-[#c0392b] focus-visible:ring-offset-2'
        >
          {t('donation_widget.continue')}
        </button>
      </div>
    </div>
  );
};

export default DetailsStep;
