'use client';

import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { ContributionTypesLabels } from './config';
import Select from '@/components/utils/Select';
import Input from '@/components/utils/Input/Input';
import { Contribution } from '@/models/database';
import Button from '@/components/utils/Button';
import dynamic from 'next/dynamic';
import {
  addOrganizationContribution,
  updateOrganizationContribution,
} from './service';
import TextArea from '@/components/utils/TextArea/TextArea';

export type ContributionFormInput = Pick<
  Contribution,
  'value' | 'donor' | 'description' | 'type'
> & { contribution_date: Date };

type FormContributionProps = {
  formType: 'create' | 'update';
};

const HawkStarsDatePicker = dynamic(
  () => import('@/components/utils/DatePicker/DatePicker')
);

const FormContributions = ({ formType }: FormContributionProps) => {
  const {
    formState: {},
    handleSubmit,
    control,
  } = useForm<ContributionFormInput>({
    defaultValues: {
      value: 0,
      donor: '',
      description: '',
      contribution_date: new Date(),
      type: 'BANK',
    },
  });

  const onSubmitForm: SubmitHandler<ContributionFormInput> = async (
    data: ContributionFormInput
  ) => {
    if (formType == 'create') return await addOrganizationContribution(data);
    return await updateOrganizationContribution(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmitForm)}
      className='mx-auto flex w-1/2 flex-col gap-5'
    >
      <Controller
        control={control}
        name='contribution_date'
        render={({ field: { onChange, value, ref } }) => (
          <HawkStarsDatePicker
            date={value}
            onChange={onChange}
            labelText='Contribution Date'
          />
        )}
      />

      <Controller
        control={control}
        name='value'
        render={({ field: { onChange, value, ref } }) => (
          <Input
            labelText='Valor'
            name='value'
            value={value}
            onChange={onChange}
          />
        )}
      />
      <Controller
        control={control}
        name='donor'
        render={({ field: { onChange, value } }) => (
          <Input
            labelText='Doador'
            name='donor'
            value={value}
            onChange={onChange}
          />
        )}
      />
      <Controller
        control={control}
        name='description'
        render={({ field: { onChange, value, name } }) => (
          <TextArea
            labelText='Description'
            name={name}
            value={value}
            onChange={onChange}
          />
        )}
      />
      <Controller
        control={control}
        name='type'
        render={({ field: { onChange, value, ref, disabled } }) => (
          <Select
            name='type'
            labelText='Type'
            options={ContributionTypesLabels}
            onChange={onChange}
            defaultOption={ContributionTypesLabels[0]}
          />
        )}
      />
      <Button type={'submit'}>
        {formType == 'update' ? 'Update' : 'Create'}
      </Button>
    </form>
  );
};

export default FormContributions;
