import React, { FC } from 'react';
import { LuFileText, LuFile, LuTable, LuImage } from 'react-icons/lu';
import type { IconBaseProps } from 'react-icons';
import type {
  ResourceDownloadBlock as ResourceDownloadBlockProps,
  HawkDocument,
} from '@/payload-types';
import { cn } from '@/lib/utils';
import { HawkStarsSection } from '@/components/layout';
import Link from 'next/link';
import { getServerTranslation } from '@/i18n';
import { Language } from '@/i18n/settings';

const icons = {
  pdf: LuFileText,
  doc: LuFileText,
  xls: LuTable,
  image: LuImage,
  other: LuFile,
};

type ResourceItem = {
  downloadLabel: string;
  icon: React.ComponentType<IconBaseProps>;
  file: HawkDocument | null;
  title: string;
  description?: string | null;
};

export const ResourceDownloadBlock = async ({
  title,
  resources = [],
  variation,
  sectionId,
  lng,
}: ResourceDownloadBlockProps & { lng: Language }) => {
  // Server translation: this file has no 'use client', so the client hook it used to
  // call would have thrown when rendered from the server tree — and it was pinned to
  // 'en' on a pt-default site.
  const { t } = await getServerTranslation(lng, 'common');

  if (!resources || resources.length === 0) return null;

  return (
    <HawkStarsSection
      spacing='default'
      padding='none'
      cap='none'
      container
      id={sectionId || undefined}
      data-blockid='resourceDownload'
    >
      {title && (
        <h2
          className={cn(
            'mb-10 max-w-1/2 text-3xl font-bold tracking-tight text-balance text-wrap lg:mb-12 lg:text-4xl',
            {
              'text-center': variation === 'card',
              'pb-2 text-left': variation === 'list',
            }
          )}
        >
          {title}
        </h2>
      )}

      <div
        className={cn('flex flex-col space-y-2', {
          'flex flex-col': variation === 'list',
          'grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4': variation === 'card',
        })}
      >
        {resources.map((resource, index) => {
          const Icon = icons[resource.fileType as keyof typeof icons] || LuFile;
          const file = typeof resource.file === 'string' ? null : (resource.file as HawkDocument);

          return variation === 'card' ? (
            <ResourceCardVariation
              downloadLabel={t('download')}
              key={resource.id || index}
              icon={Icon}
              file={file}
              title={resource.title}
              description={resource.description}
            />
          ) : (
            <ResourceListVariation
              downloadLabel={t('download')}
              key={resource.id || index}
              icon={Icon}
              file={file}
              title={resource.title}
              description={resource.description}
            />
          );
        })}
      </div>
    </HawkStarsSection>
  );
};

const ResourceListVariation: FC<ResourceItem> = ({
  icon: Icon,
  file,
  title,
  description,
  downloadLabel,
}) => {
  return (
    <div className={cn('border-bege-dark flex gap-2 border-b pt-2 pb-4')}>
      {file && (
        <Link
          href={file?.url || '#'}
          className='flex cursor-pointer flex-row gap-2 pt-1'
          aria-label={`${downloadLabel}: ${title}`}
          download
        >
          <Icon className='text-green h-6 w-6' />
        </Link>
      )}
      <div className='flex flex-col gap-2'>
        <h3 className='text-xl font-semibold'>{title}</h3>
        {description && <p className='text-gray-700'>{description}</p>}
      </div>
    </div>
  );
};

const ResourceCardVariation: FC<ResourceItem> = ({
  icon: Icon,
  file,
  title,
  description,
  downloadLabel,
}) => {
  return (
    <div className={cn('card-sm card-hover h-full rounded-xl border border-gray-200 p-6')}>
      <h3 className='mb-2 text-xl font-semibold'>{title}</h3>
      {description && <p className='mb-4 text-gray-700'>{description}</p>}
      {file && (
        <Link href={file.url || '#'} className='mt-auto' download>
          {downloadLabel}
          <Icon className='h-6 w-6 text-green-600' />
        </Link>
      )}
    </div>
  );
};
