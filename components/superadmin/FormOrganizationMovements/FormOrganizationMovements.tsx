'use client';

import { v4 as uuidv4 } from 'uuid';

import Checkbox from '@/components/utils/Checkbox/Checkbox';
import HawkStarsDatePicker from '@/components/utils/DatePicker/DatePicker';
import Select from '@/components/utils/Select';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { OrganizationTypeMovementOptions } from './config';
import Input from '@/components/utils/Input/Input';
import { OrganizationMovement, OrganizationMovements } from '@/models/database';
import createSupabaseBrowserClient from '@/lib/supabase/client/supabaseClient';
import Button from '@/components/utils/Button';

type FormOrganizationMovementProps = {
  formType: 'create' | 'update';
};

type OrganizationMovementFormProps = Pick<
  OrganizationMovement,
  'description' | 'value' | 'type' | 'paid'
> & { movement_date: Date };

const addOrganizationMovement = async ({
  description,
  value,
  type,
  paid,
  movement_date,
}: OrganizationMovementFormProps) => {
  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase
    .from<'organization_movements', OrganizationMovements>(
      'organization_movements'
    )
    .insert({
      id: uuidv4(),
      description,
      value,
      type,
      paid,
      movement_date: movement_date.toISOString(),
      registered_by: '', // TODO: missing this
    });

  if (error) return;
  return true;
};

const updateOrganizationMovement = async ({
  description,
  value,
  type,
  movement_date,
}: OrganizationMovementFormProps) => {
  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase
    .from<'organization_movements', OrganizationMovements>(
      'organization_movements'
    )
    .update({
      description,
      value,
      type,
      movement_date: movement_date.toISOString(),
    })
    .eq('id', 1);

  if (error) return;
  return true;
};

const FormOrganizationMovement = ({
  formType,
}: FormOrganizationMovementProps) => {
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
      className='mx-auto mt-5 flex w-1/2 flex-col gap-3'
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
              (item) =>
                item.value == value || OrganizationTypeMovementOptions[0]
            )}
          ></Select>
        )}
      />
      <Controller
        control={control}
        render={({ field: { value, onChange, name } }) => (
          <Input
            labelText='Value'
            name={name}
            value={value}
            onChange={onChange}
          ></Input>
        )}
        name={'value'}
      />
      <Controller
        control={control}
        name='description'
        render={({ field: { value, onChange, name } }) => (
          <Input
            labelText='Description'
            name={name}
            value={value}
            onChange={onChange}
          ></Input>
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
          <HawkStarsDatePicker date={value} onChange={onChange} />
        )}
        name={'movement_date'}
      />
      <Button type={'button'}>
        {formType == 'update' ? 'Update' : 'Create'}
      </Button>
    </form>
  );
};

export default FormOrganizationMovement;
