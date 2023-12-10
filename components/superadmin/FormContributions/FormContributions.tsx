'use client';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { ContributionType } from './config';
import { ContributionTypesLabels } from './config';
import HawkStarsDatePicker from '@/components/utils/DatePicker/DatePicker';
import Select from '@/components/utils/Select';
import Input from '@/components/utils/Input/Input';

type ContributionsFormInput = {
  value: number;
  donor: string;
  description: string;
  contribution_date: Date;
  type: ContributionType;
};

const FormContributions = () => {
  const {
    formState: {},
    handleSubmit,
    control,
  } = useForm<ContributionsFormInput>({
    defaultValues: {
      value: 0,
      donor: '',
      description: '',
      contribution_date: new Date(),
      type: 'bank',
    },
  });

  const onSubmitForm: SubmitHandler<ContributionsFormInput> = (
    data: ContributionsFormInput
  ) => {
    console.log(data);
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
          <Input labelText='Valor' name='value' value={value} />
        )}
      />
      <Controller
        control={control}
        name='donor'
        render={({ field: { onChange, value, ref } }) => (
          <Input labelText='Doador' name='donor' value={value} />
        )}
      />
      <textarea name='description' />
      <Controller
        control={control}
        name='type'
        render={({ field: { onChange, value, ref } }) => (
          <Select
            options={ContributionTypesLabels}
            onChange={() => {}}
            defaultOption={ContributionTypesLabels[0]}
          />
        )}
      />
    </form>
  );
};

export default FormContributions;
