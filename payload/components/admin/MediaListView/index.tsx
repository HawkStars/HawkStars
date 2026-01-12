'use client';

import type { ListViewClientProps } from 'payload';

import {
  useListQuery,
  useModal,
  Gutter,
  Pagination,
  PerPage,
  useStepNav,
  ListControls,
  SelectionProvider,
  TableColumnsProvider,
} from '@payloadcms/ui';
import { useBulkUpload } from '@payloadcms/ui';
import { useConfig } from '@payloadcms/ui';
import { useTranslation } from '@payloadcms/ui';
import { formatAdminURL } from '@payloadcms/ui/shared';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { Fragment, useEffect } from 'react';

import { getMediaUrl } from '@/payload/utilities/getMediaUrl';
import type { Media } from '@/payload-types';

export default function MediaListView(props: ListViewClientProps) {
  const {
    collectionSlug,
    columnState,
    hasCreatePermission,
    newDocumentURL,
    renderedFilters,
    resolvedFilterOptions,
  } = props;

  const router = useRouter();
  const { data, handlePageChange, handlePerPageChange } = useListQuery();
  const { openModal } = useModal();
  const { drawerSlug: bulkUploadDrawerSlug, setCollectionSlug, setOnSuccess } = useBulkUpload();

  const {
    config: {
      routes: { admin: adminRoute },
    },
    getEntityConfig,
  } = useConfig();

  const collectionConfig = getEntityConfig({ collectionSlug });
  const { labels, upload } = collectionConfig;

  const isBulkUploadEnabled = Boolean(upload) && collectionConfig.upload.bulkUpload;

  const { i18n } = useTranslation();
  const { setStepNav } = useStepNav();

  const openBulkUpload = React.useCallback(() => {
    setCollectionSlug(collectionSlug);
    openModal(bulkUploadDrawerSlug);
    setOnSuccess(() => router.refresh());
  }, [router, collectionSlug, bulkUploadDrawerSlug, openModal, setCollectionSlug, setOnSuccess]);

  useEffect(() => {
    setStepNav([
      {
        label: labels?.plural,
      },
    ]);
  }, [setStepNav, labels, i18n]);

  const docs = (data?.docs as Media[]) || [];

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
                  {isBulkUploadEnabled && hasCreatePermission && (
                    <button
                      className='cursor-pointer rounded-md border-none bg-zinc-200 px-4 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-600'
                      onClick={openBulkUpload}
                      type='button'
                    >
                      {i18n.t('upload:bulkUpload')}
                    </button>
                  )}
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

              {/* Media Grid */}
              <div className='grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6 md:grid-cols-[repeat(auto-fill,minmax(320px,1fr))] lg:grid-cols-[repeat(auto-fill,minmax(350px,1fr))] xl:grid-cols-[repeat(auto-fill,minmax(380px,1fr))]'>
                {docs?.map((doc) => {
                  const imageUrl = getMediaUrl(doc.url, doc.updatedAt);
                  const editUrl = formatAdminURL({
                    adminRoute,
                    path: `/collections/${collectionSlug}/${doc.id}`,
                  });

                  return (
                    <Link
                      key={doc.id}
                      href={editUrl}
                      className='group flex flex-col overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 text-inherit no-underline transition-all hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-lg focus:outline-2 focus:outline-offset-2 focus:outline-green-500 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-zinc-600'
                    >
                      <div className='relative aspect-4/3 w-full overflow-hidden bg-zinc-200 lg:aspect-3/2 dark:bg-zinc-700'>
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={doc.alt || doc.filename || 'Media'}
                            className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]'
                            loading='lazy'
                          />
                        ) : (
                          <div className='flex h-full w-full items-center justify-center bg-zinc-200 text-sm text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400'>
                            <span>No preview</span>
                          </div>
                        )}
                      </div>
                      <div className='flex flex-col gap-1 p-3'>
                        <span
                          className='truncate text-sm font-medium text-zinc-900 dark:text-zinc-100'
                          title={doc.filename || undefined}
                        >
                          {doc.filename || 'Untitled'}
                        </span>
                        {doc.alt && (
                          <span
                            className='truncate text-xs text-zinc-500 dark:text-zinc-400'
                            title={doc.alt}
                          >
                            {doc.alt}
                          </span>
                        )}
                        {doc.section && (
                          <span className='w-fit rounded bg-zinc-200 px-1.5 py-0.5 text-[10px] tracking-wide text-zinc-700 uppercase dark:bg-zinc-700 dark:text-zinc-300'>
                            {doc.section}
                          </span>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Empty State */}
              {docs.length === 0 && (
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
