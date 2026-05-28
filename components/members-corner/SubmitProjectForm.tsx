'use client';

import { useState } from 'react';
import { Controller, useFieldArray, useForm, SubmitHandler } from 'react-hook-form';
import { useTranslation } from '@/i18n/client';
import Input from '@/components/utils/Input/Input';
import TextArea from '@/components/utils/TextArea/TextArea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const LANGUAGE_OPTIONS = ['pt', 'en', 'es', 'fr', 'de', 'it', 'other'] as const;

type DateEntry = {
  label: string;
  date: string;
  link: string;
};

type FormInput = {
  title: string;
  description: string;
  language: (typeof LANGUAGE_OPTIONS)[number];
  image_url: string;
  video_url: string;
  dates: DateEntry[];
  submitter_name: string;
  submitter_email: string;
};

type SubmitProjectFormProps = {
  lng: string;
};

const isValidUrl = (value: string) => {
  if (!value) return true;
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

const SubmitProjectForm = ({ lng }: SubmitProjectFormProps) => {
  const { t } = useTranslation(lng, 'members-corner');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const {
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors },
  } = useForm<FormInput>({
    defaultValues: {
      title: '',
      description: '',
      language: 'pt',
      image_url: '',
      video_url: '',
      dates: [],
      submitter_name: '',
      submitter_email: '',
    },
    mode: 'onChange',
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'dates' });

  const onSubmit: SubmitHandler<FormInput> = async (data) => {
    if (!data.image_url && !data.video_url) {
      setError('image_url', { type: 'manual', message: t('form.media_required') });
      return;
    }

    setStatus('loading');
    try {
      const res = await fetch('/api/member-projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          dates: data.dates.filter((d) => d.label && d.date),
        }),
      });

      if (!res.ok) throw new Error('Request failed');

      setStatus('success');
      reset();
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className='mx-auto max-w-xl px-4 py-16 text-center'>
        <h2 className='text-h2_semibold text-green mb-4'>{t('form.success_title')}</h2>
        <p className='text-body text-disabled'>{t('form.success_message')}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='mx-auto flex max-w-2xl flex-col gap-6 px-4 py-12'>
      <p className='text-body text-disabled'>{t('form.intro')}</p>

      <Controller
        control={control}
        name='title'
        rules={{ required: t('form.required') }}
        render={({ field: { onChange, value, name } }) => (
          <Input
            name={name}
            labelText={t('form.title_label')}
            placeholder={t('form.title_placeholder')}
            value={value}
            onChange={onChange}
            outline
            errorMessage={errors.title?.message}
          />
        )}
      />

      <Controller
        control={control}
        name='description'
        rules={{ required: t('form.required') }}
        render={({ field: { onChange, value, name } }) => (
          <TextArea
            name={name}
            labelText={t('form.description_label')}
            placeholder={t('form.description_placeholder')}
            value={value}
            onChange={onChange}
            errorMessage={errors.description?.message}
          />
        )}
      />

      <Controller
        control={control}
        name='language'
        rules={{ required: t('form.required') }}
        render={({ field: { onChange, value } }) => (
          <div className='flex flex-col gap-2'>
            <label className='text-body_semibold'>{t('form.language_label')}</label>
            <p className='-my-1'>{t('form.language_hint')}</p>
            <Select value={value} onValueChange={onChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGE_OPTIONS.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {t(`languages.${opt}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      />

      <Controller
        control={control}
        name='image_url'
        rules={{ validate: (v) => isValidUrl(v) || t('form.invalid_url') }}
        render={({ field: { onChange, value, name } }) => (
          <Input
            name={name}
            labelText={t('form.image_label')}
            inputHintText={t('form.image_hint')}
            value={value}
            onChange={onChange}
            outline
            errorMessage={errors.image_url?.message}
          />
        )}
      />

      <Controller
        control={control}
        name='video_url'
        rules={{ validate: (v) => isValidUrl(v) || t('form.invalid_url') }}
        render={({ field: { onChange, value, name } }) => (
          <Input
            name={name}
            labelText={t('form.video_label')}
            inputHintText={t('form.video_hint')}
            value={value}
            onChange={onChange}
            outline
            errorMessage={errors.video_url?.message}
          />
        )}
      />

      {/* Dates / happenings */}
      <div className='flex flex-col gap-3'>
        <label className='text-body_semibold'>{t('form.dates_label')}</label>
        <p className='-mt-2'>{t('form.dates_hint')}</p>

        {fields.map((dateField, index) => (
          <div key={dateField.id} className='border-bege-dark flex flex-col gap-3 rounded-md border p-4'>
            <Controller
              control={control}
              name={`dates.${index}.label`}
              render={({ field: { onChange, value, name } }) => (
                <Input
                  name={name}
                  labelText={t('form.date_what_label')}
                  value={value}
                  onChange={onChange}
                  outline
                />
              )}
            />
            <Controller
              control={control}
              name={`dates.${index}.date`}
              render={({ field: { onChange, value, name } }) => (
                <Input
                  name={name}
                  type='date'
                  labelText={t('form.date_when_label')}
                  value={value}
                  onChange={onChange}
                  outline
                />
              )}
            />
            <Controller
              control={control}
              name={`dates.${index}.link`}
              rules={{ validate: (v) => isValidUrl(v || '') || t('form.invalid_url') }}
              render={({ field: { onChange, value, name } }) => (
                <Input
                  name={name}
                  labelText={t('form.date_link_label')}
                  value={value}
                  onChange={onChange}
                  outline
                  errorMessage={errors.dates?.[index]?.link?.message}
                />
              )}
            />
            <button
              type='button'
              onClick={() => remove(index)}
              className='text-disabled self-start text-sm hover:underline'
            >
              {t('form.remove')}
            </button>
          </div>
        ))}

        <button
          type='button'
          onClick={() => append({ label: '', date: '', link: '' })}
          className='text-green self-start text-body_semibold hover:underline'
        >
          + {t('form.add_date')}
        </button>
      </div>

      <Controller
        control={control}
        name='submitter_name'
        rules={{ required: t('form.required') }}
        render={({ field: { onChange, value, name } }) => (
          <Input
            name={name}
            labelText={t('form.name_label')}
            value={value}
            onChange={onChange}
            outline
            errorMessage={errors.submitter_name?.message}
          />
        )}
      />

      <Controller
        control={control}
        name='submitter_email'
        rules={{
          required: t('form.required'),
          pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: t('form.invalid_email') },
        }}
        render={({ field: { onChange, value, name } }) => (
          <Input
            name={name}
            type='email'
            labelText={t('form.email_label')}
            inputHintText={t('form.email_hint')}
            value={value}
            onChange={onChange}
            outline
            errorMessage={errors.submitter_email?.message}
          />
        )}
      />

      {status === 'error' && <p className='text-red-600'>{t('form.error_message')}</p>}

      <Button type='submit' disabled={status === 'loading'}>
        {status === 'loading' ? t('form.submitting') : t('form.submit')}
      </Button>
    </form>
  );
};

export default SubmitProjectForm;
