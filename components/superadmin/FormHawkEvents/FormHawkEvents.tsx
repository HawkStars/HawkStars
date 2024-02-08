import Button from '@/components/utils/Button';
import Input from '@/components/utils/Input/Input';
import ReactMarkdownEditor from '@/components/utils/ReactMarkdownEditor/ReactMarkdownEditor';
import createSupabaseBrowserClient from '@/lib/supabase/client/supabaseClient';
import { HAWK_EVENT_TABLE_NAME, HawkEvent, HawkEvents } from '@/models/database';
import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import DatePicker from '@/components/utils/DatePicker/DatePicker';
import CloudinaryUploader, {
  CloudinaryUploaderResponse,
} from '@/components/utils/CloudinaryUploader/CloudinaryUploader';

type HawkEventForm = Pick<
  HawkEvent,
  'title' | 'description' | 'start_event_date' | 'end_event_date'
>;

type FormHawkEventsProps = {
  event: HawkEvent | null;
  type: 'add' | 'update';
};

const FormHawkEvents: React.FC<FormHawkEventsProps> = ({ type, event }: FormHawkEventsProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<HawkEventForm>({
    values: {
      title: event?.title || '',
      description: event?.description || '',
      start_event_date: event?.start_event_date || new Date().toISOString(),
      end_event_date: event?.end_event_date || null,
    },
  });

  const onSubmit = async (formData: HawkEventForm) => {
    const supabase = createSupabaseBrowserClient();
    if (type == 'add') {
      const { error } = await supabase
        .from(HAWK_EVENT_TABLE_NAME)
        .insert({ ...formData, id: uuidv4() })
        .select()
        .single();

      if (error) return toast.error('Erro ao criar evento');

      toast.success('Evento criado com sucesso');
    } else {
      if (!event?.id) return toast.error('Erro ao atualizar evento - id não encontrado');

      const { error } = await supabase
        .from('hawk_events')
        .update({ ...formData })
        .match({ id: event?.id })
        .select()
        .single();

      if (error) return toast.error('Erro ao atualizar evento');

      toast.success('Evento atualizado com sucesso');
    }
  };

  const uploadCloudinary = (response: CloudinaryUploaderResponse) => {
    const { success } = response;
    if (!success) return toast.error('Erro ao fazer upload da imagem');

    const { data } = response;

    if (!data.info) return;
  };

  return (
    <>
      <h2 className='text-center text-green'>{type == 'add' ? 'Add' : 'Update'}</h2>
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-10'>
        <Controller
          control={control}
          name={'title'}
          rules={{ required: true }}
          render={({ field: { value, onChange, name } }) => (
            <Input labelText='Title' name={name} value={value} onChange={onChange}></Input>
          )}
        />
        <Controller
          control={control}
          rules={{ required: true }}
          render={({ field: { value, onChange } }) => (
            <ReactMarkdownEditor value={value} onChange={onChange} label='Description' />
          )}
          name={'description'}
        />
        <div className='flex flex-row gap-4'>
          <Controller
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <DatePicker date={new Date(value)} onChange={onChange} labelText='Start Date' />
            )}
            name='start_event_date'
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
            name='end_event_date'
          />
        </div>

        <div className='flex justify-center'>
          <Button type='submit'>{type == 'add' ? 'Add' : 'Update'}</Button>
        </div>
      </form>
      <div>
        <h6>Photos</h6>
        <CloudinaryUploader onUpload={uploadCloudinary} />
        <Button type='button'>Assign to Photos</Button>
      </div>
    </>
  );
};

export default FormHawkEvents;
