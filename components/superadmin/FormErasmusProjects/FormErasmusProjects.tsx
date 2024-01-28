import Button from '@/components/utils/Button';
import Input from '@/components/utils/Input/Input';
import ReactMarkdownEditor from '@/components/utils/ReactMarkdownEditor/ReactMarkdownEditor';
import createSupabaseBrowserClient from '@/lib/supabase/client/supabaseClient';
import { ErasmusProject } from '@/models/database';

import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

type ErasmusFormData = Pick<ErasmusProject, 'title' | 'description'>;

const FormErasmusProjects: React.FC = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ErasmusFormData>({
    defaultValues: { title: '', description: '' },
  });

  const onSubmit = async (data: ErasmusFormData) => {
    const supabase = createSupabaseBrowserClient();

    const { error } = await supabase.from('erasmus_projects').insert(data);
    error ? toast.error('Erro ao criar evento') : toast.success('Evento criado com sucesso');
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
