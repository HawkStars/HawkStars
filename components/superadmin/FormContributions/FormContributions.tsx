'use client';

import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { ContributionPricing, ContributionTypesLabels, hasMinimumContribution } from './config';
import Select from '@/components/utils/Select';
import Input from '@/components/utils/Input/Input';
import { Contribution, ContributionType } from '@/models/database';
import Button from '@/components/utils/Button';
import dynamic from 'next/dynamic';
import TextArea from '@/components/utils/TextArea/TextArea';
import Spinner from '@/components/utils/Spinner/Spinner';
import { useTranslation } from '@/i18n/client';
import { useState } from 'react';

export type ContributionFormInput = Pick<
  Contribution,
  'value' | 'donor' | 'extra_info' | 'type'
> & { contribution_date: Date };

type FormContributionProps = {
  formType: 'create' | 'update';
  onSubmit: (data: ContributionFormInput) => void;
  lng?: string;
  loading?: boolean;
  contribution?: Contribution;
};

const HawkStarsDatePicker = dynamic(() => import('@/components/utils/DatePicker/DatePicker'), {
  ssr: false,
  loading: () => <Spinner />,
});

const FormContributions = ({
  formType,
  onSubmit,
  lng = 'en',
  loading = false,
  contribution,
}: FormContributionProps) => {
  const [minDefaultValue, setMinDefaultValue] = useState<number>(0);
  const { t } = useTranslation(lng, 'contribute');
  const {
    handleSubmit,
    control,
    formState: { isDirty, isValid, errors },
    setValue,
    watch,
  } = useForm<ContributionFormInput>({
    defaultValues: {
      value: contribution ? contribution.value : 0,
      donor: contribution ? contribution.donor : '',
      extra_info: contribution ? contribution.extra_info : '',
      contribution_date: contribution ? new Date(contribution.contribution_date) : new Date(),
      type: contribution ? contribution.type : 'BANK',
    },
    mode: 'onChange',
  });

  const typeWatched = watch('type');
  const blockTypeForm = [
    'AUDITORIUM_CHAIR',
    'OFFICE_CHAIR',
    'LOUNGE_CHAIR',
    'SIMULATOR_CHAIR',
  ].includes(typeWatched);

  const onSubmitForm: SubmitHandler<ContributionFormInput> = async (
    data: ContributionFormInput
  ) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className='flex flex-col gap-5 px-10'>
      <Controller
        control={control}
        name='donor'
        rules={{ required: 'This is required' }}
        render={({ field: { onChange, value } }) => (
          <Input
            labelText={t('contribution_form.donor')}
            name='donor'
            value={value}
            onChange={onChange}
            outline={true}
            inputHintText={t('contribution_form.donor_hint')}
            errorMessage={errors.donor?.message}
          />
        )}
      />
      <Controller
        control={control}
        name='value'
        rules={{
          required: 'This is required',
          min: { value: minDefaultValue, message: 'Value is not ok' },
        }}
        render={({ field: { onChange, value } }) => {
          return (
            <Input
              labelText={t('contribution_form.value')}
              name='value'
              value={value}
              onChange={onChange}
              disabled={blockTypeForm}
              icon='€'
              outline={true}
              type='number'
              min={minDefaultValue}
              errorMessage={errors.value?.message || undefined}
            />
          );
        }}
      />

      <Controller
        control={control}
        name='extra_info'
        rules={{ required: 'This is required' }}
        render={({ field: { onChange, value, name } }) => (
          <TextArea
            labelText={t('contribution_form.other_information')}
            name={name}
            value={value}
            onChange={onChange}
            inputHintText='Nome Completo / Número de Identificação Fiscal (NIF) / Morada'
          />
        )}
      />
      <Controller
        control={control}
        name='type'
        render={({ field: { onChange, value } }) => {
          const handleContributionType = (type: ContributionType) => {
            const contributionValue = ContributionPricing[type];
            setValue('value', contributionValue || 0);

            const minContribution = hasMinimumContribution.includes(type) && contributionValue;
            setMinDefaultValue(minContribution ? contributionValue : 0);
            onChange(type);
          };

          return (
            <Select
              name='type'
              labelText={t('contribution_form.type')}
              options={ContributionTypesLabels}
              outline={true}
              onChange={(item) => handleContributionType(item as ContributionType)}
              defaultOption={ContributionTypesLabels.find((item) => item.value == value)}
            />
          );
        }}
      />
      <Controller
        control={control}
        name='contribution_date'
        render={({ field: { onChange, value } }) => (
          <HawkStarsDatePicker
            date={value}
            onChange={onChange}
            labelText={t('contribution_form.date')}
          />
        )}
      />
      <Button type={'submit'} loading={loading} disabled={!!isDirty && !isValid}>
        {formType == 'update' ? 'Update' : 'Create'}
      </Button>
    </form>
  );
};

export default FormContributions;
