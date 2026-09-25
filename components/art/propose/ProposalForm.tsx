'use client';

import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from '@/i18n/client';
import { useLanguageCookie } from '@/utils/contexts/AppProvider';
import { ART_CATEGORIES } from '@/payload/collections/ArtCollection/categories';
import { Button } from '@/components/ui/button';
import { ArtInput, ArtSelect, ArtTextArea } from '../ui/ArtField';
import { EMAIL_PATTERN, postJson } from '../forms/utils';
import { PROPOSE_ANCHOR } from './constants';

type ProposalInput = {
  name: string;
  email: string;
  discipline: string;
  portfolio_url: string;
  message: string;
  consent: boolean;
};

const URL_PATTERN = /^https?:\/\/\S+$/i;

/** "É artista? Proponha a sua obra" — saved as an Artist Proposal and emailed to the curators. */
export default function ProposalForm() {
  const lng = useLanguageCookie();
  const { t } = useTranslation(lng, 'art');
  const [status, setStatus] = useState<'idle' | 'sent' | 'error'>('idle');
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProposalInput>();

  const onSubmit: SubmitHandler<ProposalInput> = async (values) => {
    const ok = await postJson('/api/art-gallery/proposal', values);
    setStatus(ok ? 'sent' : 'error');
    if (ok) reset();
  };

  const required = t('purchase.errors.required');

  return (
    <section id={PROPOSE_ANCHOR} className='art-spotlight scroll-mt-24 px-4 py-20 lg:px-8 lg:py-28'>
      <div className='art-panel mx-auto max-w-5xl p-6 md:p-12'>
        <div className='text-center'>
          <p className='art-eyebrow'>{t('propose.form_eyebrow')}</p>
          <h2 className='art-heading mt-4 md:text-5xl'>{t('propose.form_title')}</h2>
          <p className='text-art-text-2 mx-auto mt-4 lg:whitespace-nowrap'>
            {t('propose.form_text')}
          </p>
        </div>

        {status === 'sent' ? (
          <p
            role='status'
            className='border-art-gold/40 bg-art-gold-bright/5 text-art-cream mt-10 border p-6 text-center'
          >
            {t('propose.success')}
          </p>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className='mt-10 grid gap-6 sm:grid-cols-2'
          >
            <ArtInput
              underline
              label={`${t('propose.name')} *`}
              autoComplete='name'
              error={errors.name && required}
              {...register('name', { required: true, maxLength: 120 })}
            />
            <ArtInput
              underline
              label={`${t('propose.email')} *`}
              type='email'
              autoComplete='email'
              error={errors.email && required}
              {...register('email', { required: true, pattern: EMAIL_PATTERN })}
            />
            <ArtSelect
              underline
              label={`${t('propose.discipline')} *`}
              defaultValue=''
              error={errors.discipline && required}
              {...register('discipline', { required: true })}
            >
              <option value='' disabled>
                {t('propose.discipline_placeholder')}
              </option>
              {ART_CATEGORIES.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label[lng]}
                </option>
              ))}
            </ArtSelect>
            <ArtInput
              underline
              label={`${t('propose.portfolio')} *`}
              type='url'
              placeholder='https://'
              error={errors.portfolio_url && required}
              {...register('portfolio_url', { required: true, pattern: URL_PATTERN })}
            />
            <ArtTextArea
              underline
              label={`${t('propose.message')} *`}
              placeholder={t('propose.message_placeholder')}
              wrapperClassName='sm:col-span-2'
              rows={5}
              error={errors.message && required}
              {...register('message', { required: true, maxLength: 4000 })}
            />
            <div className='sm:col-span-2'>
              <label className='art-justify text-art-text-2 flex items-start gap-3 text-xs leading-relaxed'>
                <input
                  type='checkbox'
                  aria-invalid={!!errors.consent}
                  className='accent-art-gold-bright border-art-line mt-0.5 h-4 w-4 shrink-0'
                  {...register('consent', { required: true })}
                />
                <span>
                  {t('propose.consent_1')}{' '}
                  <strong className='text-art-text'>{t('propose.consent_strong')}</strong>{' '}
                  {t('propose.consent_2')}
                </span>
              </label>
              {errors.consent && (
                <p role='alert' className='text-art-terracotta mt-2 text-xs'>
                  {t('propose.consent_required')}
                </p>
              )}
            </div>
            {status === 'error' && (
              <p role='alert' className='text-art-terracotta text-sm sm:col-span-2'>
                {t('propose.error')}
              </p>
            )}
            <Button
              type='submit'
              variant='art'
              size='art'
              className='sm:col-span-2 sm:justify-self-center'
              disabled={isSubmitting}
            >
              {isSubmitting ? t('propose.submitting') : t('propose.submit')}
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
