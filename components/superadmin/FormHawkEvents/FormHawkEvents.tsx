'use client';

import Button from '@/components/utils/Button';
import Input from '@/components/utils/Input/Input';
import ReactMarkdownEditor from '@/components/utils/ReactMarkdownEditor/ReactMarkdownEditor';
import createSupabaseBrowserClient from '@/lib/supabase/client/supabaseClient';
import { HAWK_EVENT_TABLE_NAME, HawkEvent, HawkEvents } from '@/models/database';
import React, { useEffect, useState } from 'react';
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
};

const defaultValues = {
  title: '',
  description: '',
  start_event_date: new Date().toISOString(),
  end_event_date: null,
} as HawkEventForm;

const FormHawkEvents: React.FC<FormHawkEventsProps> = ({ event }: FormHawkEventsProps) => {
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>(event?.photos || []);
  const title = event?.id == null ? 'Add' : 'Update';

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isValid },
  } = useForm<HawkEventForm>({
    defaultValues: {
      title: event?.title || '',
      description: event?.description || '',
      start_event_date: event?.start_event_date || new Date().toISOString(),
      end_event_date: event?.end_event_date || null,
    },
    reValidateMode: 'onBlur',
  });

  const onSubmit = async (formData: HawkEventForm) => {
    const supabase = createSupabaseBrowserClient();
    if (event?.id == null) {
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
        .from<'hawk_events', HawkEvents>(HAWK_EVENT_TABLE_NAME)
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

    debugger;
    if (!data.info) return;

    const photos = data.info as unknown;
    // setSelectedPhotos((photos) => [...photos, photos.secure_url]);
  };

  const addPhotosToEvent = async () => {
    const supabase = createSupabaseBrowserClient();

    if (!event?.id) return toast.error('Erro ao adicionar fotos ao evento - id não encontrado');

    const { error } = await supabase
      .from<'hawk_events', HawkEvents>(HAWK_EVENT_TABLE_NAME)
      .update({ photos: selectedPhotos })
      .eq('id', event.id);

    if (error) return toast.error('Erro ao adicionar foto ao evento');
    toast.success('Fotos adicionada ao evento com sucesso');
  };

  useEffect(() => {
    reset(event || defaultValues);
  }, [event, reset]);

  return (
    <>
      <h2 className='text-center text-green'>{title}</h2>
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-10'>
        <Controller
          control={control}
          name={'title'}
          rules={{ required: true }}
          render={({ field: { value, onChange, name } }) => (
            <Input
              labelText='Title'
              name={name}
              value={value}
              onChange={onChange}
              errorMessage={errors.title?.message}
            ></Input>
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
        <div className='flex flex-col gap-4 lg:flex-row'>
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
          <Button type='submit' disabled={(!isDirty && !isValid) == true}>
            {title}
          </Button>
        </div>
      </form>
      <div className='mt-5 border-t pt-5'>
        <h6 className='text-center text-green underline'>Photos</h6>
        <div className='mt-3 flex flex-col gap-2'>
          <CloudinaryUploader onUpload={uploadCloudinary} customCss='mx-auto' />
          <Button type='button' onClick={addPhotosToEvent} className='mx-auto'>
            Assign to Photos
          </Button>
        </div>
      </div>
    </>
  );
};

export default FormHawkEvents;
