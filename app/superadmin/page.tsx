import Checkbox from '@/components/utils/Checkbox/Checkbox';
import HawkStarsDatePicker from '@/components/utils/DatePicker/DatePicker';
import Input from '@/components/utils/Input/Input';
import Select, { SelectOption } from '@/components/utils/Select';
import { useForm } from 'react-hook-form';
import { ContributionTypes, OrganizationTypeMovementOptions } from './config';

const SuperAdminPage = () => {
  return (
    <section>
      <FormOrganizationMovement type={'create'} />
    </section>
  );
};

export default SuperAdminPage;

const FormContributions = () => {
  const form = useForm();
  return (
    <div>
      <HawkStarsDatePicker date={new Date()} onChange={() => {}} />
      <Input labelText='Valor' />
      <Input labelText='Doador' />
      <textarea name='description' />
      <Select options={ContributionTypes} onChange={() => {}} />
    </div>
  );
};

type FormOrganizationMovementProps = {
  type: 'create' | 'update';
};

const FormOrganizationMovement = ({ type }: FormOrganizationMovementProps) => {
  const form = useForm();
  return (
    <div>
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
    </div>
  );
};
