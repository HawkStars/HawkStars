import React from 'react';
import RichText from '@/payload/components/RichText';
import Image from 'next/image';
import Link from 'next/link';
import { CalendarIcon, UsersIcon, LinkIcon, TagIcon } from 'lucide-react';
import type { BoardMember, ProjectBlock as ProjectBlockProps } from '@/payload-types';
import { cn } from '@/lib/utils';

export const ProjectBlock: React.FC<ProjectBlockProps> = ({
  title,
  description,
  image,
  status,
  progress,
  startDate,
  endDate,
  budget,
  tags,
  team,
  links,
}) => {
  const statusColors = {
    planning: 'bg-blue-100 text-blue-800',
    'in-progress': 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    'on-hold': 'bg-gray-100 text-gray-800',
  };

  const statusLabels = {
    planning: 'Planning',
    'in-progress': 'In Progress',
    completed: 'Completed',
    'on-hold': 'On Hold',
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const budgetProgress =
    budget?.total && budget?.raised ? Math.min((budget.raised / budget.total) * 100, 100) : 0;

  return (
    <div className='py-12'>
      <div className='mx-auto max-w-6xl px-4'>
        <div className='overflow-hidden rounded-lg bg-white shadow-lg'>
          {/* Header */}
          <div className='bg-linear-to-r from-blue-500 to-green-500 px-6 py-4 text-white'>
            <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between'>
              <div className='flex-1'>
                <h2 className='mb-2 text-2xl font-bold lg:text-3xl'>{title}</h2>
                <div className='flex flex-wrap items-center gap-4'>
                  <span
                    className={cn(
                      'rounded-full px-3 py-1 text-sm font-medium',
                      statusColors[status]
                    )}
                  >
                    {statusLabels[status]}
                  </span>
                  {progress !== undefined && (
                    <div className='flex items-center gap-2'>
                      <div className='h-2 w-32 rounded-full bg-white/20'>
                        <div
                          className='h-2 rounded-full bg-white transition-all duration-300'
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className='text-sm font-medium'>{progress}%</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className='p-6'>
            <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
              {/* Main Content */}
              <div className='lg:col-span-2'>
                {image && (
                  <div className='mb-6'>
                    <div className='relative h-64 overflow-hidden rounded-lg lg:h-80'>
                      <Image
                        src={typeof image === 'string' ? image : image.url || '/placeholder.jpg'}
                        alt={title}
                        fill
                        className='object-cover'
                      />
                    </div>
                  </div>
                )}

                {description && (
                  <div className='prose prose-lg max-w-none'>
                    <RichText data={description} />
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className='space-y-6'>
                {/* Timeline */}
                {(startDate || endDate) && (
                  <div className='rounded-lg bg-gray-50 p-4'>
                    <h4 className='mb-3 flex items-center gap-2 font-semibold text-gray-900'>
                      <CalendarIcon className='h-5 w-5' />
                      Timeline
                    </h4>
                    <div className='space-y-2 text-sm'>
                      {startDate && (
                        <div>
                          <span className='font-medium'>Start:</span> {formatDate(startDate)}
                        </div>
                      )}
                      {endDate && (
                        <div>
                          <span className='font-medium'>
                            {status === 'completed' ? 'Completed:' : 'Target:'}
                          </span>{' '}
                          {formatDate(endDate)}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Budget */}
                {budget && (budget.total || budget.raised) && (
                  <div className='rounded-lg bg-gray-50 p-4'>
                    <h4 className='mb-3 font-semibold text-gray-900'>Budget</h4>
                    <div className='space-y-2'>
                      {budget.total && (
                        <div className='text-sm'>
                          <span className='font-medium'>Total:</span> {budget.currency || '€'}
                          {budget.total.toLocaleString()}
                        </div>
                      )}
                      {budget.raised && (
                        <div className='text-sm'>
                          <span className='font-medium'>Raised:</span> {budget.currency || '€'}
                          {budget.raised.toLocaleString()}
                        </div>
                      )}
                      {budget.total && budget.raised && (
                        <div className='mt-2'>
                          <div className='h-2 rounded-full bg-gray-200'>
                            <div
                              className='h-2 rounded-full bg-green-500 transition-all duration-300'
                              style={{ width: `${budgetProgress}%` }}
                            />
                          </div>
                          <div className='mt-1 text-xs text-gray-600'>
                            {budgetProgress.toFixed(0)}% funded
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Team */}
                {team && team.length > 0 && (
                  <div className='rounded-lg bg-gray-50 p-4'>
                    <h4 className='mb-3 flex items-center gap-2 font-semibold text-gray-900'>
                      <UsersIcon className='h-5 w-5' />
                      Team
                    </h4>
                    <div className='space-y-2'>
                      {team.map((member, index) => (
                        <div key={index} className='text-sm'>
                          <div className='font-medium'>
                            {(member.member as BoardMember)?.name || 'Team Member'}
                          </div>
                          {member.role && <div className='text-gray-600'>{member.role}</div>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {tags && tags.length > 0 && (
                  <div className='rounded-lg bg-gray-50 p-4'>
                    <h4 className='mb-3 flex items-center gap-2 font-semibold text-gray-900'>
                      <TagIcon className='h-5 w-5' />
                      Tags
                    </h4>
                    <div className='flex flex-wrap gap-2'>
                      {tags.map((tag, index) => (
                        <span
                          key={index}
                          className='rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800'
                        >
                          {tag.tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Links */}
                {links && links.length > 0 && (
                  <div className='rounded-lg bg-gray-50 p-4'>
                    <h4 className='mb-3 flex items-center gap-2 font-semibold text-gray-900'>
                      <LinkIcon className='h-5 w-5' />
                      Links
                    </h4>
                    <div className='space-y-2'>
                      {links.map((link, index) => (
                        <Link
                          key={index}
                          href={link.url}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='block text-sm text-blue-600 hover:text-blue-800 hover:underline'
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
