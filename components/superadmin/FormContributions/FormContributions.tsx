'use client';

import { v4 as uuidv4 } from 'uuid';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { ContributionTypesLabels } from './config';
import HawkStarsDatePicker from '@/components/utils/DatePicker/DatePicker';
import Select from '@/components/utils/Select';
import Input from '@/components/utils/Input/Input';
import { Contribution, Contributions } from '@/models/database';
import createSupabaseBrowserClient from '@/lib/supabase/client/supabaseClient';

type ContributionFormInput = Pick<
  Contribution,
  'value' | 'donor' | 'description' | 'type'
> & { contribution_date: Date };

type FormContributionProps = {
  formType: 'create' | 'update';
};

const addOrganizationContribution = async ({
  value,
  donor,
  description,
  type,
  contribution_date,
}: ContributionFormInput) => {
  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase
    .from<'contibutions', Contributions>('contibutions')
    .insert({
      id: uuidv4(),
      value,
      description,
      donor,
      type,
      contribution_date: contribution_date.toISOString(),
      registered_by: '1',
    });

  if (error) return;
  return true;
};

const updateOrganizationContribution = async ({
  value,
  donor,
  description,
  type,
  contribution_date,
}: ContributionFormInput) => {
  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase
    .from<'contributions', Contributions>('contributions')
    .update({
      value,
      donor,
      description,
      type,
      contribution_date: contribution_date.toISOString(),
    })
    .eq('id', 1);

  if (error) return;
  return true;
};

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
      className='mx-auto flex w-1/2 flex-col gap-3'
    >
      <Controller
        control={control}
        name='contribution_date'
        render={({ field: { onChange, value, ref } }) => (
          <HawkStarsDatePicker date={value} onChange={onChange} />
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
        render={({ field: { onChange, value, ref } }) => (
          <Input
            labelText='Doador'
            name='donor'
            value={value}
            onChange={onChange}
          />
        )}
      />
      <textarea name='description' />
      <Controller
        control={control}
        name='type'
        render={({ field: { onChange, value, ref } }) => (
          <Select
            name='type'
            labelText='Type'
            options={ContributionTypesLabels}
            onChange={onChange}
            defaultOption={ContributionTypesLabels[0]}
          />
        )}
      />
    </form>
  );
};

export default FormContributions;
