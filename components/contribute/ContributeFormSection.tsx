'use client';

import { Contribution } from '@/payload-types';
import { LanguageProps } from '../types';
import FormContributions, { ContributionFormInput } from './FormContributions/FormContributions';
import { useState } from 'react';
import * as Sentry from '@sentry/nextjs';

const ContributeFormSection = ({ lng }: LanguageProps) => {
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>(
    'idle'
  );

  const handleSubmitForm = async (data: ContributionFormInput) => {
    try {
      setSubmitStatus('submitting');
      const newDoc: Pick<Contribution, 'is_anonymous'> = {
        ...data,
      };

      const response = await fetch('/api/contribution', {
        method: 'POST',
        body: JSON.stringify(newDoc),
      });

      await response.json();
      setSubmitStatus('success');
    } catch (e) {
      Sentry.captureException(e);
      setSubmitStatus('error');
    }
  };

  return (
    <div className='mx-auto mt-10 lg:w-1/2'>
      {submitStatus === 'idle' && (
        <FormContributions formType={'create'} lng={lng} onSubmit={handleSubmitForm} />
      )}
      {submitStatus === 'submitting' && <p>Submitting...</p>}
      {submitStatus === 'success' && <p>Thank you for your contribution!</p>}
      {submitStatus === 'error' && (
        <p>There was an error submitting your contribution. Please try again.</p>
      )}
    </div>
  );
};

export default ContributeFormSection;
