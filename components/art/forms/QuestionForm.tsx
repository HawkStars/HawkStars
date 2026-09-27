'use client';

import { FormEvent, useState } from 'react';
import { LuHeadset, LuSend } from 'react-icons/lu';
import { useTranslation } from '@/i18n/client';
import { useLanguageCookie } from '@/utils/contexts/AppProvider';
import { Button } from '@/components/ui/button';
import { ArtInput, ArtTextArea } from '../ui/ArtField';

type QuestionFormProps = {
  artworkTitle: string;
  artworkReference: string;
  contactEmail: string;
  contactPhone?: string | null;
};

/**
 * "Painel de Dúvida Curatorial": an automatic email to the gallery — the subject
 * is pre-filled with the artwork title and reference (editable), and sending
 * opens the visitor's email app with everything filled in, as in the brief.
 */
export default function QuestionForm({
  artworkTitle,
  artworkReference,
  contactEmail,
  contactPhone,
}: QuestionFormProps) {
  const lng = useLanguageCookie();
  const { t } = useTranslation(lng, 'art');
  const [subject, setSubject] = useState(() =>
    t('question.subject_default', { title: artworkTitle, ref: artworkReference })
  );
  const [message, setMessage] = useState('');

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const body = [
      message.trim(),
      '',
      t('question.body_ref', { ref: artworkReference, title: artworkTitle }),
    ]
      .join('\n')
      .trim();
    const params = new URLSearchParams({ subject, body }).toString().replace(/\+/g, '%20');
    window.location.href = `mailto:${contactEmail}?${params}`;
  };

  return (
    <form onSubmit={onSubmit} className='flex flex-col gap-4'>
      <ArtInput
        label={t('question.subject')}
        value={subject}
        onChange={(event) => setSubject(event.target.value)}
        required
        className='font-mono text-xs'
      />
      <ArtTextArea
        label={t('question.message')}
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        placeholder={t('question.message_placeholder')}
        required
      />
      <div className='grid gap-3 sm:grid-cols-2'>
        <Button
          type='submit'
          variant='art-outline'
          size='art'
          className={contactPhone ? '' : 'sm:col-span-2'}
        >
          <LuSend aria-hidden />
          {t('question.send')}
        </Button>
        {contactPhone && (
          <Button asChild variant='art-outline' size='art' className='bg-art-ebony'>
            <a href={`tel:${contactPhone.replace(/\s+/g, '')}`}>
              <LuHeadset aria-hidden />
              {t('question.phone')}
            </a>
          </Button>
        )}
      </div>
      <p className='text-art-muted text-center text-xs'>
        {t('question.direct')}{' '}
        <a href={`mailto:${contactEmail}`} className='text-art-cream'>
          {contactEmail}
        </a>
        {contactPhone && <> • {contactPhone}</>}
      </p>
      <p className='text-art-muted text-center text-[11px]'>{t('question.hint')}</p>
    </form>
  );
}
