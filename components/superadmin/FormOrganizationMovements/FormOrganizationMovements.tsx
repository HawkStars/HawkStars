'use client';

import Checkbox from '@/components/utils/Checkbox/Checkbox';
import Select from '@/components/utils/Select';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { OrganizationTypeMovementOptions } from './config';
import Input from '@/components/utils/Input/Input';
import { OrganizationMovement } from '@/models/database';
import Button from '@/components/utils/Button';
import dynamic from 'next/dynamic';
import { addOrganizationMovement, updateOrganizationMovement } from './service';
import Spinner from '@/components/utils/Spinner/Spinner';

type FormOrganizationMovementProps = {
  formType: 'create' | 'update';
};

export type OrganizationMovementFormProps = Pick<
  OrganizationMovement,
  'description' | 'value' | 'type' | 'paid'
> & { movement_date: Date };

const HawkStarsDatePicker = dynamic(() => import('@/components/utils/DatePicker/DatePicker'), {
  ssr: false,
  loading: () => <Spinner />,
});

const FormOrganizationMovement = ({ formType }: FormOrganizationMovementProps) => {
  const {
    handleSubmit,
    control,
    formState: {},
  } = useForm<OrganizationMovementFormProps>({
    defaultValues: {
      description: '',
      value: 0,
      type: 'CREDIT',
      movement_date: new Date(),
      paid: false,
    },
  });

  const onSubmit: SubmitHandler<OrganizationMovementFormProps> = async (
    data: OrganizationMovementFormProps
  ) => {
    if (formType == 'create') return await addOrganizationMovement(data);
    return await updateOrganizationMovement(data);
  };

  return (
    <form
      className='mx-auto my-10 flex w-11/12 flex-col gap-6 lg:w-1/2'
      onSubmit={handleSubmit(onSubmit)}
    >
      <Controller
        name='type'
        control={control}
        render={({ field: { value, onChange, name } }) => (
          <Select
            labelText='Type of Movement'
            name={name}
            onChange={onChange}
            options={OrganizationTypeMovementOptions}
            defaultOption={OrganizationTypeMovementOptions.find(
              (item) => item.value == value || OrganizationTypeMovementOptions[0]
            )}
          ></Select>
        )}
      />
      <Controller
        control={control}
        render={({ field: { value, onChange, name } }) => (
          <Input labelText='Value' name={name} value={value} onChange={onChange}></Input>
        )}
        name={'value'}
      />
      <Controller
        control={control}
        name='description'
        render={({ field: { value, onChange, name } }) => (
          <Input labelText='Description' name={name} value={value} onChange={onChange}></Input>
        )}
      />
      <Controller
        control={control}
        render={({ field: { value, onChange, name } }) => (
          <Checkbox labelText='Paid' checked={value} id={name} name={name} onChange={onChange} />
        )}
        name='paid'
      />
      <Controller
        control={control}
        render={({ field: { value, onChange, name } }) => (
          <HawkStarsDatePicker date={value} onChange={onChange} labelText='Movement Date' />
        )}
        name={'movement_date'}
      />
      <Button type={'submit'}>{formType == 'update' ? 'Update' : 'Create'}</Button>
    </form>
  );
};

export default FormOrganizationMovement;
