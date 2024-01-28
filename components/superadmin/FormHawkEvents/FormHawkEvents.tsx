import Button from '@/components/utils/Button';
import Input from '@/components/utils/Input/Input';
import ReactMarkdownEditor from '@/components/utils/ReactMarkdownEditor/ReactMarkdownEditor';
import createSupabaseBrowserClient from '@/lib/supabase/client/supabaseClient';
import { HawkEvent } from '@/models/database';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

type HawkEventForm = Pick<HawkEvent, 'title' | 'description'>;

const FormHawkEvents: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<HawkEventForm>({
    defaultValues: { title: '', description: '' },
  });

  const onSubmit = async (data: HawkEventForm) => {
    const supabase = createSupabaseBrowserClient();

    const { error } = await supabase.from('hawk_events').insert(data);
    error ? toast.error('Erro ao criar evento') : toast.success('Evento criado com sucesso');
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
