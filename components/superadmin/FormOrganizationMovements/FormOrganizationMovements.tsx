'use client';

import Checkbox from '@/components/utils/Checkbox/Checkbox';
import HawkStarsDatePicker from '@/components/utils/DatePicker/DatePicker';
import Select from '@/components/utils/Select';
import { Controller, useForm } from 'react-hook-form';
import { OrganizationTypeMovementOptions } from './config';
import Input from '@/components/utils/Input/Input';
import { ReactElement, JSXElementConstructor } from 'react';
import { OrganizationMovement } from '@/models/database';

type FormOrganizationMovementProps = {
  formType: 'create' | 'update';
};

type OrganizationMovementFormProps = Pick<
  OrganizationMovement,
  'description' | 'value' | 'type' | 'paid' | 'movement_date'
>;

const FormOrganizationMovement = ({
  formType,
}: FormOrganizationMovementProps) => {
  const {
    control,
    formState: {},
  } = useForm<OrganizationMovementFormProps>({
    defaultValues: { description: '', value: 0, type: 'CREDIT' },
  });

  return (
    <form className='mx-auto mt-5 flex w-1/2 flex-col gap-3'>
      <Controller
        name='type'
        control={control}
        render={({ field: { value, onChange, name } }) => (
          <Select
            name={name}
            onChange={() => {}}
            options={OrganizationTypeMovementOptions}
            defaultOption={OrganizationTypeMovementOptions.find(
              (item) =>
                item.value == formType || OrganizationTypeMovementOptions[0]
            )}
          ></Select>
        )}
      />
      <Controller
        control={control}
        render={({ field: { value, onChange, name } }) => (
          <Input labelText='Value' name={name}></Input>
        )}
        name={'value'}
      />
      <Controller
        control={control}
        name='description'
        render={({ field: { value, onChange, name } }) => (
          <Input labelText='Description' name={name}></Input>
        )}
      />
      {/* paid */}
      <Controller
        control={control}
        render={({ field: { value, onChange, name } }) => (
          <Checkbox
            labelText='Paid'
            checked={value}
            id={name}
            name={name}
            onChange={onChange}
          />
        )}
        name='paid'
      />
      <Controller
        control={control}
        render={({ field: { value, onChange, name } }) => (
          <HawkStarsDatePicker date={new Date()} onChange={() => {}} />
        )}
        name={'movement_date'}
      />
    </form>
  );
};

export default FormOrganizationMovement;
