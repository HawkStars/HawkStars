import Button from '@/components/utils/Button';
import Input from '@/components/utils/Input/Input';
import ReactMarkdownEditor from '@/components/utils/ReactMarkdownEditor/ReactMarkdownEditor';
import createSupabaseBrowserClient from '@/lib/supabase/client/supabaseClient';
import { ErasmusProject } from '@/models/database';
import { v4 as uuidv4 } from 'uuid';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import DatePicker from '@/components/utils/DatePicker/DatePicker';

type ErasmusProjectForm = Pick<
  ErasmusProject,
  'title' | 'description' | 'start_project_date' | 'end_project_date'
>;

type FormErasmusProjectsProps = {
  event: ErasmusProjectForm | null;
  type: 'add' | 'update';
};

const FormErasmusProjects: React.FC<FormErasmusProjectsProps> = ({
  event,
  type,
}: FormErasmusProjectsProps) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ErasmusProjectForm>({
    defaultValues: {
      title: '',
      description: '',
      start_project_date: event?.start_project_date || new Date().toISOString(),
      end_project_date: event?.end_project_date || null,
    },
  });

  const onSubmit = async (data: ErasmusProjectForm) => {
    const supabase = createSupabaseBrowserClient();

    const { error } = await supabase.from('erasmus_projects').insert({ ...data, id: uuidv4() });
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
      <div className='flex flex-row gap-4'>
        <Controller
          control={control}
          render={({ field: { value, onChange } }) => (
            <DatePicker date={new Date(value)} onChange={onChange} labelText='Start Date' />
          )}
          name='start_project_date'
        />
        <Controller
          control={control}
          render={({ field: { value, onChange } }) => (
            <DatePicker
              date={value ? new Date(value) : null}
              onChange={onChange}
              labelText='End Date'
            />
          )}
          name='end_project_date'
        />
      </div>
      <Button type='submit'>Submeter</Button>
    </form>
  );
};

export default FormErasmusProjects;
