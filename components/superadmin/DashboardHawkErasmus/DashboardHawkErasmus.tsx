// 'use client';

// import createSupabaseBrowserClient from '@/lib/supabase/client/supabaseClient';
// import { ErasmusProject } from '@/models/database';
// import React, { useCallback, useEffect, useState } from 'react';
// import ReactPaginate from 'react-paginate';
// import { PAGE_SIZE, getPageRange } from '@/utils/page';
// import Button from '@/components/utils/Button';
// import { PiPlus } from 'react-icons/pi';
// import LineBreaker from '@/components/utils/LineBreaker/LineBreaker';
// import { RxCross2 } from 'react-icons/rx';
// import FormErasmusProjects from '../FormErasmusProjects/FormErasmusProjects';

// type ErasmusProjectsInformation = {
//   events: ErasmusProject[];
//   page: number;
//   count: number;
// };

// type HawkErasmusProject = {
//   event: ErasmusProject | null;
//   type: 'add' | 'update';
// };

// const DashboardHawkErasmus: React.FC = () => {
//   const [selectedEvent, setSelectedEvent] = useState<HawkErasmusProject | null>(null);
//   const [hawkEvents, setHawkEvents] = useState<ErasmusProjectsInformation>({
//     events: [],
//     page: 1,
//     count: 0,
//   });
//   const { events, count, page } = hawkEvents;

//   const getAllEvents = useCallback(async () => {
//     const supabase = createSupabaseBrowserClient();

//     const [lowerRange, upperRange] = getPageRange(page);
//     const { error, data, count } = await supabase
//       .from('erasmus_projects')
//       .select('*', { count: 'exact' })
//       .order('id', { ascending: true })
//       .range(lowerRange, upperRange);

//     setHawkEvents((currentInfo) => ({
//       events: error ? [] : data,
//       count: count || 0,
//       page: currentInfo.page,
//     }));
//   }, [page]);

//   const handlePageChange = (data: { selected: number }) => {
//     setHawkEvents((currentInfo) => ({ ...currentInfo, page: data.selected }));
//   };

//   useEffect(() => {
//     getAllEvents();
//   }, [getAllEvents]);

//   return (
//     <div className='flex flex-col gap-5'>
//       {events.length == 0 && <div>No erasmus events found</div>}
//       {events.map((event) => (
//         <div
//           className='flex flex-row justify-between gap-8 rounded border px-4 py-2'
//           key={event.id}
//         >
//           <div className='my-auto font-bold'>{event.title}</div>
//           <div className='truncate text-wrap text-left'>{event.description}</div>
//           <div>
//             <Button type={'button'} onClick={() => setSelectedEvent({ event, type: 'update' })}>
//               Editar
//             </Button>
//           </div>
//         </div>
//       ))}
//       <div>
//         {count > events.length && (
//           <ReactPaginate
//             nextLabel='>'
//             previousLabel='<'
//             onPageChange={handlePageChange}
//             pageRangeDisplayed={3}
//             marginPagesDisplayed={2}
//             pageCount={Math.ceil(count / PAGE_SIZE)}
//             className='flex flex-row justify-center gap-3'
//             activeClassName='text-green font-bold'
//           />
//         )}
//       </div>
//       <div
//         className='mx-auto flex w-fit cursor-pointer justify-center rounded-full bg-bege-dark p-2'
//         onClick={() => setSelectedEvent({ event: null, type: 'add' })}
//       >
//         <PiPlus className='fill-green' size={32} />
//       </div>
//       {selectedEvent && (
//         <>
//           <LineBreaker />
//           <div className='flex justify-end'>
//             <RxCross2
//               className='fill-red cursor-pointer'
//               size={32}
//               onClick={() => setSelectedEvent(null)}
//             />
//           </div>
//           <FormErasmusProjects {...selectedEvent} />
//         </>
//       )}
//     </div>
//   );
// };

// export default DashboardHawkErasmus;
