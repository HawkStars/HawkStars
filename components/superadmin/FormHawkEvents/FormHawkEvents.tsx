import Button from '@/components/utils/Button';
import Input from '@/components/utils/Input/Input';
import ReactMarkdownEditor from '@/components/utils/ReactMarkdownEditor/ReactMarkdownEditor';
import createSupabaseBrowserClient from '@/lib/supabase/client/supabaseClient';
import { HawkEvent } from '@/models/database';
import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import DatePicker from '@/components/utils/DatePicker/DatePicker';

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

  const onSubmit = async (data: HawkEventForm) => {
    const supabase = createSupabaseBrowserClient();

    const { error } = await supabase.from('hawk_events').insert({ ...data, id: uuidv4() });
    error ? toast.error('Erro ao criar evento') : toast.success('Evento criado com sucesso');
  };

  return (
    <>
      <h2 className='text-center text-green'>{type == 'add' ? 'Add' : 'Update'}</h2>
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-10'>
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
    </>
  );
};

export default FormHawkEvents;
