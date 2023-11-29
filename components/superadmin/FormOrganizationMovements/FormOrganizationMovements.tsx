'use client';

import Checkbox from '@/components/utils/Checkbox/Checkbox';
import HawkStarsDatePicker from '@/components/utils/DatePicker/DatePicker';
import Select from '@/components/utils/Select';
import { useForm } from 'react-hook-form';
import { OrganizationTypeMovementOptions } from './config';
import Input from '@/components/utils/Input/Input';

type FormOrganizationMovementProps = {
  type: 'create' | 'update';
};

const FormOrganizationMovement = ({ type }: FormOrganizationMovementProps) => {
  const form = useForm();
  return (
    <form className='mx-auto flex w-1/2 flex-col gap-3'>
      <Select
        onChange={() => {}}
        options={OrganizationTypeMovementOptions}
        defaultOption={OrganizationTypeMovementOptions.find(
          (item) => item.value == type
        )}
      ></Select>
      <Input labelText='Value'></Input>
      <Input labelText='Description'></Input>
      {/* paid */}
      <Checkbox
        labelText='Paid'
        checked={false}
        id={'paid'}
        name={'paid'}
      ></Checkbox>
      <HawkStarsDatePicker date={new Date()} onChange={() => {}} />
    </form>
  );
};

export default FormOrganizationMovement;
