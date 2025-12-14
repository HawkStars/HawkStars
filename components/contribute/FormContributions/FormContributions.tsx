'use client';

import { Controller, SubmitHandler, useForm, useWatch } from 'react-hook-form';
import Input from '@/components/utils/Input/Input';
import { Button } from '@/components/ui/button';
import dynamic from 'next/dynamic';
import TextArea from '@/components/utils/TextArea/TextArea';
import Spinner from '@/components/utils/Spinner/Spinner';
import { useTranslation } from '@/i18n/client';
import { useState } from 'react';
import Checkbox from '@/components/utils/Checkbox/Checkbox';
import { hasMinimumContribution, ContributionTypesLabels } from './config';
import { Contribution } from '@/payload-types';
import { ContributionType } from '@/components/transparency/config';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { priceOfContribution } from '@/payload/collections/Contribution/config';

export type ContributionFormInput = Pick<
  Contribution,
  'value' | 'donor' | 'extra_info' | 'contribution_type' | 'is_anonymous'
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
    formState: { errors },
    setValue,
  } = useForm<ContributionFormInput>({
    defaultValues: {
      value: contribution?.value || 0,
      donor: contribution?.donor || '',
      extra_info: contribution?.extra_info || '',
      contribution_date: contribution?.contribution_date
        ? new Date(contribution.contribution_date)
        : new Date(),
      contribution_type: contribution?.contribution_type || 'BANK',
      is_anonymous: contribution?.is_anonymous || false,
    },
    mode: 'onChange',
  });

  const blockTypeForm = useWatch({
    control,
    name: 'contribution_type',
    compute: (data) =>
      ['AUDITORIUM_CHAIR', 'OFFICE_CHAIR', 'LOUNGE_CHAIR', 'SIMULATOR_CHAIR'].includes(data),
  });

  const anonymousChecked = useWatch({
    control,
    name: 'is_anonymous',
  });

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
        rules={{
          validate: (value, formValues) =>
            formValues.is_anonymous
              ? true
              : (value && value.length > 0 && true) || 'This is required',
        }}
        render={({ field: { onChange, value } }) => (
          <Input
            labelText={t('contribution_form.donor')}
            name='donor'
            value={value}
            onChange={onChange}
            outline={true}
            inputHintText={t('contribution_form.donor_hint')}
            errorMessage={errors.donor?.message}
            disabled={!!anonymousChecked}
          />
        )}
      />
      <Controller
        control={control}
        name='is_anonymous'
        render={({ field: { onChange, value, name } }) => {
          const handleToggleAnonymous = (value: boolean) => {
            setValue('is_anonymous', value);
            setValue('donor', '');
            onChange(value);
          };

          return (
            <div className='-mt-4'>
              <Checkbox
                labelText={t('contribution_form.anomymous')}
                name='donor'
                checked={value || false}
                onChange={(checked: boolean) => handleToggleAnonymous(checked)}
                id={name}
              />
            </div>
          );
        }}
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
        render={({ field: { onChange, value, name } }) => (
          <TextArea
            labelText={t('contribution_form.other_information')}
            name={name}
            value={value || ''}
            onChange={onChange}
            inputHintText='Nome Completo / Número de Identificação Fiscal (NIF) / Morada'
          />
        )}
      />
      <Controller
        control={control}
        name='contribution_type'
        render={({ field: { onChange, value } }) => {
          const handleContributionType = (type: ContributionType) => {
            const contributionValue = priceOfContribution[type];
            setValue('value', contributionValue || 0);

            const minContribution = hasMinimumContribution.includes(type) && contributionValue;
            setMinDefaultValue(minContribution ? contributionValue : 0);
            onChange(type);
          };

          return (
            <Select name='type' onValueChange={handleContributionType} defaultValue={value}>
              <SelectTrigger>
                <SelectValue placeholder='Type' />
              </SelectTrigger>
              <SelectContent>
                {ContributionTypesLabels.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
      <Button type={'submit'}>{formType == 'update' ? 'Update' : 'Create'}</Button>
    </form>
  );
};

export default FormContributions;
