'use client';

import createSupabaseBrowserClient from '@/lib/supabase/client/supabaseClient';
import FormHawkEvents from '@/components/superadmin/FormHawkEvents/FormHawkEvents';
import { HawkEvent } from '@/models/database';
import React, { useCallback, useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';

type HawkInformation = {
  events: HawkEvent[];
  page: number;
  count: number;
};

const PAGE_SIZE = 10 as const;

const DashboardHawkEvents: React.FC = () => {
  const [hawkEvents, setHawkEvents] = useState<HawkInformation>({ events: [], page: 1, count: 0 });
  const { events, count, page } = hawkEvents;

  const getAllEvents = useCallback(async () => {
    const supabase = createSupabaseBrowserClient();

    const { error, data, count } = await supabase
      .from('hawk_events')
      .select('*', { count: 'exact' })
      .order('id', { ascending: true })
      .range(hawkEvents.page, 10);

    setHawkEvents((currentInfo) => ({
      events: error ? [] : data,
      count: count || 0,
      page: currentInfo.page,
    }));
  }, [hawkEvents.page]);

  const handlePageChange = (data: any) => {
    console.log(data);
  };

  useEffect(() => {
    getAllEvents();
  }, [getAllEvents]);

  return (
    <div className='flex flex-col'>
      <div className='flex flex-row justify-between'>
        {events.length == 0 && <div>No events found</div>}
        {events.map((event) => (
          <div key={event.id}>{event.title}</div>
        ))}
      </div>
      <div>
        {count > events.length && (
          <ReactPaginate
            nextLabel='>'
            previousLabel='<'
            onPageChange={handlePageChange}
            pageRangeDisplayed={3}
            marginPagesDisplayed={2}
            pageCount={count / PAGE_SIZE}
            className='flex flex-row justify-center gap-3'
          />
        )}
      </div>
      <FormHawkEvents />
    </div>
  );
};

export default DashboardHawkEvents;
