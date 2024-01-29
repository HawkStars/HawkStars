import MarkdownViewer from '@/components/utils/ReactMarkdownViewer/ReactMarkdownViewer';
import createSupabaseServerClient from '@/lib/supabase/server/supabaseServerClient';
import React from 'react';

const getHawkEventsData = async () => {
  const supabase = createSupabaseServerClient();

  const { data } = await supabase.from('hawk_events').select('*').order('id', { ascending: true });
  return data;
};

const EventsPage = async () => {
  const events = await getHawkEventsData();

  return (
    <section className='layout-section'>
      <h1>Events Page</h1>
      <p>Welcome to the Events Page!</p>
      {events?.map((event) => {
        return (
          <div key={event.id}>
            <div>{event.title}</div>
            <MarkdownViewer source={event.description} />
          </div>
        );
      })}
    </section>
  );
};

export default EventsPage;
