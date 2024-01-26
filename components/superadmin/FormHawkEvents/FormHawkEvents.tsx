import Button from '@/components/utils/Button';
import Input from '@/components/utils/Input/Input';
import ReactMarkdownEditor from '@/components/utils/ReactMarkdownEditor/ReactMarkdownEditor';
import { HawkEvent } from '@/models/database';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';

type HawkEventForm = Pick<HawkEvent, 'title' | 'description'>;

const FormHawkEvents: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<HawkEventForm>({
    defaultValues: { title: '', description: '' },
  });

  const onSubmit = (data: HawkEventForm) => {
    // Handle form submission here
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
      <Controller
        control={control}
        name={'title'}
        render={({ field: { value, onChange, name } }) => (
          <Input labelText='Title' name={name} value={value} onChange={onChange}></Input>
        )}
      />
      <Controller
        control={control}
        render={({ field: { value, onChange } }) => (
          <ReactMarkdownEditor value={value} onChange={onChange} />
        )}
        name={'description'}
      />
      <Button type='submit'>Submeter</Button>
    </form>
  );
};

export default FormHawkEvents;
