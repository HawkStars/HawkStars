'use client';

import createSupabaseBrowserClient from '@/lib/supabase/client/supabaseClient';
import FormHawkEvents from '@/components/superadmin/FormHawkEvents/FormHawkEvents';
import { HawkEvent } from '@/models/database';
import React, { useCallback, useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { PAGE_SIZE, getPageRange } from '@/utils/page';
import Button from '@/components/utils/Button';
import { PiPlus } from 'react-icons/pi';
import LineBreaker from '@/components/utils/LineBreaker/LineBreaker';
import { RxCross2 } from 'react-icons/rx';
import Popup from '@/components/utils/Popup/Popup';

type HawkInformation = {
  events: HawkEvent[];
  page: number;
  count: number;
};

type HawkEventChange = {
  event: HawkEvent | null;
};

const DashboardHawkEvents: React.FC = () => {
  const [dashboardSettings, setDashboardSettings] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<HawkEventChange | null>(null);
  const [hawkEvents, setHawkEvents] = useState<HawkInformation>({ events: [], page: 0, count: 0 });
  const { events, count, page } = hawkEvents;

  const getAllEvents = useCallback(async () => {
    const supabase = createSupabaseBrowserClient();

    const [lowerRange, upperRange] = getPageRange(page);
    const { error, data, count } = await supabase
      .from('hawk_events')
      .select('*', { count: 'exact' })
      .order('id', { ascending: true })
      .range(lowerRange, upperRange);

    setHawkEvents((currentInfo) => ({
      events: error ? [] : data,
      count: count || 0,
      page: currentInfo.page,
    }));
  }, [page]);

  const handlePageChange = (data: any) => {
    setHawkEvents((currentInfo) => ({ ...currentInfo, page: data.selected }));
  };

  const deleteSelectedEvent = (event: HawkEvent) => async () => {
    const supabase = createSupabaseBrowserClient();

    const { id } = event;
    const { error } = await supabase.from('hawk_events').delete().match({ id });

    if (error) return;

    getAllEvents();
  };

  useEffect(() => {
    getAllEvents();
  }, [getAllEvents]);

  return (
    <>
      <Popup
        isOpen={dashboardSettings}
        acceptFunction={() => {}}
        closePopup={() => setDashboardSettings(false)}
      />
      <div className='flex flex-col gap-10 lg:flex-row lg:gap-20'>
        <div className='lg:w-1/3'>
          <div className='flex flex-col gap-5'>
            {events.length == 0 && <div>No events found</div>}
            {events.map((event) => (
              <div
                className='flex flex-row justify-between gap-8 rounded border p-2'
                key={event.id}
              >
                <div className='font-bold'>{event.title}</div>
                <div className='flex gap-2'>
                  <Button type={'button'} onClick={() => setSelectedEvent({ event })}>
                    Editar
                  </Button>
                  <Button type={'button'} variant='error' onClick={deleteSelectedEvent(event)}>
                    Delete
                  </Button>
                </div>
              </div>
            ))}
            <div>
              {count > events.length && (
                <ReactPaginate
                  nextLabel='>'
                  previousLabel='<'
                  onPageChange={handlePageChange}
                  pageRangeDisplayed={3}
                  marginPagesDisplayed={2}
                  pageCount={Math.ceil(count / PAGE_SIZE)}
                  className='flex flex-row justify-center gap-3'
                  activeClassName='text-green font-bold'
                />
              )}
            </div>
          </div>
        </div>
        <div className='bg-bege-light p-3 lg:w-2/3'>
          <div
            className='mx-auto flex w-fit cursor-pointer justify-center rounded-full bg-bege-dark p-2'
            onClick={() => setSelectedEvent({ event: null })}
          >
            <PiPlus className='fill-green' size={32} />
          </div>
          {selectedEvent && (
            <>
              <LineBreaker />
              <div className='flex justify-end'>
                <RxCross2
                  className='fill-red cursor-pointer'
                  size={32}
                  onClick={() => setSelectedEvent(null)}
                />
              </div>
              <FormHawkEvents {...selectedEvent} />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default DashboardHawkEvents;
