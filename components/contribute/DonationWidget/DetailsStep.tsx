import { useState } from 'react';
import { useTranslation } from '@/i18n/client';
import { useLanguageCookie } from '@/utils/contexts/AppProvider';

type DetailsStepProps = {
  comment: string;
  onCommentChange: (comment: string) => void;
  onBack: () => void;
  onNext: () => void;
};

const DetailsStep = ({ comment, onCommentChange, onBack, onNext }: DetailsStepProps) => {
  const lng = useLanguageCookie();
  const { t } = useTranslation(lng, 'contribute');
  const [showComment, setShowComment] = useState(!!comment);

  return (
    <div className='flex flex-col gap-5'>
      <p className='text-center text-[15px] leading-relaxed text-[#333]'>
        {t('donation_widget.details.description')}
      </p>

      {/* Comment Toggle */}
      <div>
        <label className='flex cursor-pointer items-center gap-2'>
          <input
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
          <textarea
            value={comment}
            onChange={(e) => onCommentChange(e.target.value)}
            placeholder={t('donation_widget.details.comment_placeholder')}
            rows={3}
            style={{ resize: 'vertical' }}
            className='mt-2.5 w-full rounded-lg border border-[#ddd] px-3 py-2.5 font-[inherit] text-sm outline-none focus:border-[#c0392b]'
          />
        )}
      </div>

      {/* Navigation */}
      <div className='flex gap-3'>
        <button
          onClick={onBack}
          className='flex-1 cursor-pointer rounded-lg border border-[#ddd] bg-white py-3 text-sm font-medium text-[#333] transition-colors duration-150 hover:border-[#c0392b]'
        >
          {t('donation_widget.back')}
        </button>
        <button
          onClick={onNext}
          className='flex-1 cursor-pointer rounded-lg border-none bg-linear-to-br from-[#c0392b] to-[#e74c3c] py-3 text-sm font-semibold text-white transition-opacity duration-200'
        >
          {t('donation_widget.continue')}
        </button>
      </div>
    </div>
  );
};

export default DetailsStep;
