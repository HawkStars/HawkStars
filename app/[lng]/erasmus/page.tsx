import createSupabaseServerClient from '@/lib/supabase/server/supabaseServerClient';

const getHawkEventsData = async () => {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from('hawk_events')
    .select('*')
    .order('id', { ascending: true });

  return error ? [] : data;
};

const ErasmusPage = async () => {
  const events = await getHawkEventsData();
  return (
    <section>
      <h1>Events Page</h1>
      <p>Welcome to the Events Page!</p>
      {/* Add more content here */}
    </section>
  );
};

export default ErasmusPage;
