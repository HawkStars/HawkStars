'use client';

import type { ListViewClientProps } from 'payload';

import {
  useListQuery,
  Gutter,
  Pagination,
  PerPage,
  useStepNav,
  ListControls,
  SelectionProvider,
  TableColumnsProvider,
} from '@payloadcms/ui';
import { useConfig } from '@payloadcms/ui';
import { useTranslation } from '@payloadcms/ui';
import { formatAdminURL } from '@payloadcms/ui/shared';
import Link from 'next/link';
import React, { Fragment, useEffect, useMemo, useState } from 'react';

import { getMediaUrl } from '@/payload/utilities/getMediaUrl';
import type { BoardMember, Media } from '@/payload-types';

const sectionLabels: Record<string, string> = {
  geral: 'Assembleia Geral',
  fiscal: 'Conselho Fiscal',
  board: 'Direção',
};

const sectionOrder = ['board', 'geral', 'fiscal'];

const titleLabels: Record<string, string> = {
  president: 'Presidente',
  vice_president: 'Vice-Presidente',
  vogal: 'Vogal',
  f_secretary: 'Secretária',
  m_secretary: 'Secretário',
  substitute: 'Suplente',
  treasurer: 'Tesoureiro',
  rapporteur_secretary: 'Secretário Relator',
  department: 'Departamento',
};

export default function BoardMemberListView(props: ListViewClientProps) {
  const {
    collectionSlug,
    columnState,
    hasCreatePermission,
    newDocumentURL,
    renderedFilters,
    resolvedFilterOptions,
  } = props;

  const { data, handlePageChange, handlePerPageChange } = useListQuery();
  const [populatedDocs, setPopulatedDocs] = useState<BoardMember[]>([]);
  const [loading, setLoading] = useState(true);

  const {
    config: {
      routes: { admin: adminRoute },
    },
    getEntityConfig,
  } = useConfig();

  const collectionConfig = getEntityConfig({ collectionSlug });
  const { labels } = collectionConfig;

  const { i18n } = useTranslation();
  const { setStepNav } = useStepNav();

  useEffect(() => {
    setStepNav([
      {
        label: labels?.plural,
      },
    ]);
  }, [setStepNav, labels, i18n]);

  // Fetch populated data when list data changes
  useEffect(() => {
    const fetchPopulatedData = async () => {
      if (!data?.docs?.length) {
        setPopulatedDocs([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Use the REST API with depth=1 to populate relationships
        const params = new URLSearchParams({
          depth: '1',
          limit: String(data.limit || 50),
          page: String(data.page || 1),
        });

        const response = await fetch(`/api/board-members?${params.toString()}`);
        if (response.ok) {
          const result = await response.json();
          setPopulatedDocs(result.docs || []);
        } else {
          // Fallback to unpopulated data
          setPopulatedDocs(data.docs as BoardMember[]);
        }
      } catch (error) {
        console.error('Failed to fetch populated board members:', error);
        setPopulatedDocs(data.docs as BoardMember[]);
      } finally {
        setLoading(false);
      }
    };

    fetchPopulatedData();
  }, [data?.docs, data?.limit, data?.page]);

  const docs = populatedDocs;

  // Group members by section
  const groupedMembers = useMemo(() => {
    const groups: Record<string, BoardMember[]> = {};

    docs.forEach((member) => {
      const section = member.section || 'other';
      if (!groups[section]) {
        groups[section] = [];
      }
      groups[section].push(member);
    });

    // Sort members within each group by position
    Object.keys(groups).forEach((section) => {
      groups[section].sort((a, b) => (a.position || 0) - (b.position || 0));
    });

    return groups;
  }, [docs]);

  // Order sections
  const orderedSections = useMemo(() => {
    return sectionOrder.filter((section) => groupedMembers[section]?.length > 0);
  }, [groupedMembers]);

  return (
    <Fragment>
      <TableColumnsProvider collectionSlug={collectionSlug} columnState={columnState}>
        <div className='w-full pb-8'>
          <SelectionProvider docs={docs} totalDocs={data?.totalDocs || 0}>
            <Gutter className='flex flex-col gap-6'>
              {/* Header */}
              <header className='flex flex-wrap items-center justify-between gap-4'>
                <h1 className='m-0 text-2xl font-semibold'>{labels?.plural as string}</h1>
                <div className='flex gap-2'>
                  {hasCreatePermission && newDocumentURL && (
                    <Link
                      className='rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white no-underline transition-colors hover:bg-green-700'
                      href={newDocumentURL}
                    >
                      {i18n.t('general:createNew')}
                    </Link>
                  )}
                </div>
              </header>

              {/* Description */}
              {collectionConfig?.admin?.description && (
                <p className='m-0 rounded-md bg-zinc-100 px-4 py-2 text-sm text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'>
                  {typeof collectionConfig.admin.description === 'string'
                    ? collectionConfig.admin.description
                    : null}
                </p>
              )}

              {/* Search and Filter Controls */}
              <ListControls
                collectionConfig={collectionConfig}
                collectionSlug={collectionSlug}
                enableColumns={true}
                enableFilters={true}
                enableSort={true}
                renderedFilters={renderedFilters}
                resolvedFilterOptions={resolvedFilterOptions}
              />

              {/* Loading State */}
              {loading && (
                <div className='flex items-center justify-center p-8'>
                  <div className='h-6 w-6 animate-spin rounded-full border-2 border-zinc-300 border-t-green-500' />
                  <span className='ml-3 text-zinc-500'>Loading members...</span>
                </div>
              )}

              {/* Members grouped by section */}
              {!loading &&
                orderedSections.map((section) => (
                  <div key={section} className='space-y-4'>
                    {/* Section Header */}
                    <div className='flex items-center gap-3'>
                      <h2 className='m-0 text-lg font-semibold text-zinc-800 dark:text-zinc-200'>
                        {sectionLabels[section] || section}
                      </h2>
                      <span className='rounded-full bg-zinc-200 px-2.5 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400'>
                        {groupedMembers[section].length}
                      </span>
                    </div>

                    {/* Members Grid */}
                    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                      {groupedMembers[section].map((member) => {
                        // Handle both populated (object) and unpopulated (string ID) cases
                        const photo =
                          member.photo && typeof member.photo === 'object'
                            ? (member.photo as Media)
                            : undefined;
                        const imageUrl = photo ? getMediaUrl(photo.url, photo.updatedAt) : null;
                        const editUrl = formatAdminURL({
                          adminRoute,
                          path: `/collections/${collectionSlug}/${member.id}`,
                        });

                        return (
                          <Link
                            key={member.id}
                            href={editUrl}
                            className='group flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white text-inherit no-underline shadow-sm transition-all hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md focus:outline-2 focus:outline-offset-2 focus:outline-green-500 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-zinc-600'
                          >
                            {/* Photo */}
                            <div className='relative aspect-square w-full overflow-hidden bg-zinc-100 dark:bg-zinc-700'>
                              {imageUrl ? (
                                <img
                                  src={imageUrl}
                                  alt={member.name || 'Board Member'}
                                  className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-105'
                                  loading='lazy'
                                />
                              ) : (
                                <div className='flex h-full w-full items-center justify-center'>
                                  <svg
                                    className='h-20 w-20 text-zinc-300 dark:text-zinc-600'
                                    fill='currentColor'
                                    viewBox='0 0 24 24'
                                  >
                                    <path d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z' />
                                  </svg>
                                </div>
                              )}
                            </div>

                            {/* Info */}
                            <div className='flex flex-col gap-1.5 p-4'>
                              <span className='text-base font-semibold text-zinc-900 dark:text-zinc-100'>
                                {member.name || 'Unnamed'}
                              </span>
                              <span className='text-sm text-zinc-600 dark:text-zinc-400'>
                                {titleLabels[member.title] || member.title}
                                {member.title === 'department' && member.department && (
                                  <span className='ml-1 text-zinc-500'>({member.department})</span>
                                )}
                              </span>
                              <div className='mt-1 flex items-center gap-2'>
                                <span className='rounded bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400'>
                                  Posição: {member.position}
                                </span>
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}

              {/* Empty State */}
              {!loading && docs.length === 0 && (
                <div className='flex items-center justify-center rounded-lg bg-zinc-100 p-16 dark:bg-zinc-800'>
                  <p className='m-0 text-base text-zinc-500 dark:text-zinc-400'>
                    {i18n.t('general:noResults')}
                  </p>
                </div>
              )}

              {/* Pagination */}
              {data && data.totalPages > 1 && (
                <div className='flex flex-wrap items-center justify-between gap-4 border-t border-zinc-200 pt-4 dark:border-zinc-700'>
                  <Pagination
                    hasNextPage={data.hasNextPage}
                    hasPrevPage={data.hasPrevPage}
                    limit={data.limit}
                    nextPage={data.nextPage || undefined}
                    numberOfNeighbors={1}
                    onChange={handlePageChange}
                    page={data.page}
                    prevPage={data.prevPage || undefined}
                    totalPages={data.totalPages}
                  />
                  <PerPage
                    handleChange={handlePerPageChange}
                    limit={data.limit}
                    limits={collectionConfig?.admin?.pagination?.limits || [10, 25, 50, 100]}
                    resetPage
                  />
                </div>
              )}
            </Gutter>
          </SelectionProvider>
        </div>
      </TableColumnsProvider>
    </Fragment>
  );
}
