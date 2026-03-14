import { useState } from 'react';

type DetailsStepProps = {
  comment: string;
  onCommentChange: (comment: string) => void;
  onBack: () => void;
  onNext: () => void;
};

const DetailsStep = ({ comment, onCommentChange, onBack, onNext }: DetailsStepProps) => {
  const [showComment, setShowComment] = useState(!!comment);

  return (
    <div className='flex flex-col gap-5'>
      <p className='text-center text-[15px] leading-relaxed text-[#333]'>
        Would you like to add any details to your donation?
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
          <span className='text-sm text-[#555]'>Write us a comment</span>
        </label>
        {showComment && (
          <textarea
            value={comment}
            onChange={(e) => onCommentChange(e.target.value)}
            placeholder='Your message (optional)'
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
          Back
        </button>
        <button
          onClick={onNext}
          className='flex-1 cursor-pointer rounded-lg border-none bg-linear-to-br from-[#c0392b] to-[#e74c3c] py-3 text-sm font-semibold text-white transition-opacity duration-200'
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default DetailsStep;
