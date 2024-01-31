import Button from '@/components/utils/Button';
import Input from '@/components/utils/Input/Input';
import ReactMarkdownEditor from '@/components/utils/ReactMarkdownEditor/ReactMarkdownEditor';
import createSupabaseBrowserClient from '@/lib/supabase/client/supabaseClient';
import { ERASMUS_PROJECT_TABLE_NAME, ErasmusProject } from '@/models/database';
import { v4 as uuidv4 } from 'uuid';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import DatePicker from '@/components/utils/DatePicker/DatePicker';
import CloudinaryUploader, {
  CloudinaryUploaderResponse,
} from '@/components/utils/CloudinaryUploader/CloudinaryUploader';

type ErasmusProjectForm = Pick<
  ErasmusProject,
  'title' | 'description' | 'start_project_date' | 'end_project_date' | 'id'
> &
  Partial<Pick<ErasmusProject, 'id'>>;

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

    if (type == 'add') {
      const { error } = await supabase
        .from(ERASMUS_PROJECT_TABLE_NAME)
        .insert({ ...data, id: uuidv4() });
      error ? toast.error('Erro ao criar evento') : toast.success('Evento criado com sucesso');
    } else {
      if (!event?.id) return toast.error('Erro ao atualizar evento - id não encontrado');

      const { error } = await supabase
        .from(ERASMUS_PROJECT_TABLE_NAME)
        .update({ ...data })
        .match({ id: event?.id });

      error
        ? toast.error('Erro ao atualizar evento')
        : toast.success('Evento atualizado com sucesso');
    }
  };

  const uploadCloudinary = (response: CloudinaryUploaderResponse) => {
    const { success } = response;
    if (!success) return toast.error('Erro ao fazer upload da imagem');

    const { data } = response;
    console.log(data);
    // return data.secure_url;
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
          <ReactMarkdownEditor value={value} onChange={onChange} label='Description' />
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
      <div className='flex justify-center'>
        <Button type='submit'>{type == 'add' ? 'Add' : 'Update'}</Button>
      </div>

      <div>
        <h6>Photos</h6>
        <CloudinaryUploader onUpload={uploadCloudinary} />
      </div>
    </form>
  );
};

export default FormErasmusProjects;
