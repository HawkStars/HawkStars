'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { transformUrl, urls } from '@/utils/paths';

type ProjectOption = {
  id: string;
  heading?: string | null;
  slug?: string | null;
};

type NewsProjectFilterProps = {
  projects: ProjectOption[];
  lng: string;
  currentProjectSlug?: string;
  allLabel?: string;
};

const NewsProjectFilter = ({
  projects,
  lng,
  currentProjectSlug,
  allLabel = 'All Projects',
}: NewsProjectFilterProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const slug = e.target.value;
      const params = new URLSearchParams(searchParams.toString());

      if (slug) {
        params.set('project', slug);
      } else {
        params.delete('project');
      }
      // Reset to page 1 when filter changes
      params.delete('page');

      const query = params.toString();
      const base = transformUrl(lng, urls.news);
      router.push(query ? `${base}?${query}` : base);
    },
    [lng, router, searchParams]
  );

  if (!projects || projects.length === 0) return null;

  return (
    <div className='flex items-center gap-3'>
      <label htmlFor='project-filter' className='text-sm font-medium text-gray-700'>
        {allLabel}:
      </label>
      <select
        id='project-filter'
        value={currentProjectSlug || ''}
        onChange={handleChange}
        className='rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-amber-400 focus:ring-1 focus:ring-amber-400 focus:outline-none'
      >
        <option value=''>{allLabel}</option>
        {projects.map((project) => (
          <option key={project.id} value={project.slug ?? ''}>
            {project.heading}
          </option>
        ))}
      </select>
    </div>
  );
};

export default NewsProjectFilter;
