import React from 'react';
import { CheckCircle, Circle, Clock } from 'lucide-react';
import type { MilestoneTrackerBlock as MilestoneTrackerBlockProps } from '@/payload-types';
import { cn } from '@/lib/utils';

export const MilestoneTrackerBlock: React.FC<MilestoneTrackerBlockProps> = ({
  title,
  milestones = [],
}) => {
  if (!milestones || milestones.length === 0) {
    return null;
  }

  const statusConfig = {
    completed: {
      icon: CheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-100',
    },
    'in-progress': {
      icon: Clock,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
    },
    upcoming: {
      icon: Circle,
      color: 'text-gray-400',
      bg: 'bg-gray-100',
    },
  };

  return (
    <section className='py-12 lg:py-20'>
      <div className='container mx-auto'>
        {title && <h2 className='mb-12 text-center text-3xl font-bold lg:text-4xl'>{title}</h2>}

        <div className='mx-auto max-w-3xl'>
          <div className='relative'>
            <div className='absolute top-0 bottom-0 left-6 w-0.5 bg-gray-300' />

            <div className='space-y-8'>
              {milestones.map((milestone, index) => {
                const config = statusConfig[milestone.status as keyof typeof statusConfig];
                const Icon = config.icon;

                return (
                  <div key={index} className='relative flex gap-6'>
                    <div
                      className={cn(
                        'z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full',
                        config.bg
                      )}
                    >
                      <Icon className={cn('h-6 w-6', config.color)} />
                    </div>

                    <div className='flex-1 pb-8'>
                      <div className='mb-2 flex items-center gap-3'>
                        <h3 className='text-xl font-semibold'>{milestone.title}</h3>
                        <span
                          className={cn(
                            'rounded-full px-3 py-1 text-xs font-semibold uppercase',
                            config.bg,
                            config.color
                          )}
                        >
                          {milestone.status.replace('-', ' ')}
                        </span>
                      </div>

                      {milestone.completedDate && (
                        <div className='mb-2 text-sm text-gray-600'>
                          {new Date(milestone.completedDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </div>
                      )}

                      {milestone.description && (
                        <p className='text-gray-700'>{milestone.description}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
