'use client';

import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Projects18Block as Projects18BlockProps, Media, HawkProject } from '@/payload-types';

export const Projects18Block: React.FC<Projects18BlockProps> = ({
  title,
  subtitle,
  description,
  projects,
  sectionId,
}) => {
  if (!projects || projects.length === 0) return null;

  // Ensure projects is an array of Project objects
  const projectsList = (Array.isArray(projects) ? projects : [projects]).filter(
    (p): p is HawkProject => p !== null && typeof p === 'object'
  );

  if (projectsList.length === 0) return null;

  return (
    <section className='py-32' id={sectionId || ''}>
      <div className='container mx-auto'>
        <div>
          {subtitle && (
            <p className='text-muted-foreground mb-1 uppercase md:text-lg'>{subtitle}</p>
          )}
          {title && <h1 className='text-3xl font-bold uppercase md:text-7xl'>{title}</h1>}
          {description && <p className='text-muted-foreground mt-7 max-w-2xl'>{description}</p>}
          <Button variant='outline' size='lg' className='mt-7'>
            View All Projects
            <ArrowDownRight className='size-4' />
          </Button>
        </div>
        <div className='mt-24 flex flex-col gap-5 md:mt-36'>
          {projectsList.map((project, idx) => {
            const imageUrl =
              typeof project.image === 'string'
                ? project.image
                : (project.image as Media)?.url || '';

            return (
              <a
                key={project.id}
                href={project.slug || '#'}
                className='group relative isolate min-h-72 bg-cover bg-center px-5 py-14 lg:px-12 lg:py-24'
                style={{
                  backgroundImage: `url(${imageUrl})`,
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
            );
          })}
        </div>
      </div>
    </section>
  );
};
