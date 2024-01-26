import Button from '@/components/utils/Button';
import Input from '@/components/utils/Input/Input';
import ReactMarkdownEditor from '@/components/utils/ReactMarkdownEditor/ReactMarkdownEditor';
import { ErasmusProject } from '@/models/database';

import React from 'react';
import { Controller, useForm } from 'react-hook-form';

type ErasmusFormData = Pick<ErasmusProject, 'title' | 'description'>;

const FormErasmusProjects: React.FC = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ErasmusFormData>({
    defaultValues: { title: '', description: '' },
  });

  const onSubmit = (data: ErasmusFormData) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
      <Controller
        control={control}
        render={({ field: { value, onChange, name } }) => (
          <Input labelText='Title' name={name} value={value} onChange={onChange}></Input>
        )}
        name={'title'}
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

export default FormErasmusProjects;
