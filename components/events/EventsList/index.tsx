import { HawkProject, Media } from '@/payload-types';
import { PaginatedDocs } from 'payload';
import { Button } from '@/components/ui/button';
import { ArrowUpRight } from 'lucide-react';
import { getImagePayloadUrl } from '@/lib/image';

type EventsListProps = {
  events: PaginatedDocs<HawkProject>;
};

const EventsList = ({ events }: EventsListProps) => {
  const { docs } = events;

  return (
    <section>
      <div className='mt-24 flex flex-col gap-5 md:mt-36'>
        {docs.map((project, idx) => (
          <a
            key={idx}
            href={`/projects/${project.slug}`}
            className='group relative isolate min-h-72 bg-cover bg-center px-5 py-14 lg:px-12 lg:py-24'
            style={{
              backgroundImage: `url(${(getImagePayloadUrl(project.image) as Media)?.url})`,
            }}
          >
            <div className='relative z-10 flex flex-col gap-7 text-white/80 transition-colors duration-300 ease-out group-hover:text-white lg:flex-row'>
              <div className='flex gap-1 text-2xl font-bold'>
                <span>/</span>
                <span>{String(idx + 1).padStart(2, '0')}</span>
              </div>
              <div className='flex flex-1 flex-col gap-2.5'>
                <h3 className='text-2xl font-bold lg:text-4xl'>{project.heading}</h3>
                <p className='text-sm font-medium uppercase'>{project.subheading}</p>
              </div>
              <div className='flex-1'>
                <div className='flex flex-col'>
                  <p>{project.description}</p>
                  <div className='mt-2.5 h-0 overflow-hidden transition-all duration-300 ease-out group-hover:h-10'>
                    <div>
                      <Button
                        variant='outline'
                        size='lg'
                        className='dark w-fit opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100'
                      >
                        View project
                        <ArrowUpRight className='size-4' />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='absolute inset-0 z-0 bg-black/80 backdrop-blur-xs transition-all duration-300 ease-out group-hover:bg-black/50 group-hover:backdrop-blur-none' />
          </a>
        ))}
      </div>
    </section>
  );
};

export default EventsList;
