import React, { FC } from 'react';
import { LuDownload, LuFileText, LuFile, LuTable, LuImage } from 'react-icons/lu';
import type { IconBaseProps } from 'react-icons';
import type {
  ResourceDownloadBlock as ResourceDownloadBlockProps,
  HawkDocument,
} from '@/payload-types';
import { cn } from '@/lib/utils';
import { HawkStarsSection } from '@/components/layout';
import { Button } from '@/components/ui/button';
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
          className={cn('text-h2_semibold mb-10 lg:mb-12', {
            'mx-auto max-w-3xl text-center': variation === 'card',
            'max-w-3xl': variation !== 'card',
          })}
        >
          {title}
        </h2>
      )}

      <div
        className={cn(
          variation === 'card'
            ? 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            : 'divide-bege-dark border-bege-dark flex flex-col divide-y border-y'
        )}
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

// Download links point straight at the stored file (often a third-party host), so they
// are plain anchors: next/link would try to client-route them.
const ResourceListVariation: FC<ResourceItem> = ({
  icon: Icon,
  file,
  title,
  description,
  downloadLabel,
}) => {
  return (
    <div className='flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:gap-6'>
      <div className='flex flex-1 gap-4'>
        <span className='bg-bege-dark text-green flex size-11 shrink-0 items-center justify-center rounded-full'>
          <Icon aria-hidden='true' className='size-5' />
        </span>
        <div className='flex flex-col gap-1'>
          <h3 className='text-h3_semibold'>{title}</h3>
          {description && (
            <p className='text-body_regular max-w-prose text-black/70'>{description}</p>
          )}
        </div>
      </div>
      {file?.url && (
        <Button asChild variant='outline' size='lg' className='self-start sm:self-center'>
          <a href={file.url} download aria-label={`${downloadLabel}: ${title}`}>
            <LuDownload aria-hidden='true' />
            {downloadLabel}
          </a>
        </Button>
      )}
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
    <div className='card card-hover flex h-full flex-col p-6'>
      <span className='bg-bege-dark text-green mb-4 flex size-11 items-center justify-center rounded-full'>
        <Icon aria-hidden='true' className='size-5' />
      </span>
      <h3 className='text-h3_semibold mb-2'>{title}</h3>
      {description && <p className='text-body_regular mb-6 text-black/70'>{description}</p>}
      {file?.url && (
        <Button asChild variant='outline' size='lg' className='mt-auto w-full'>
          <a href={file.url} download aria-label={`${downloadLabel}: ${title}`}>
            <LuDownload aria-hidden='true' />
            {downloadLabel}
          </a>
        </Button>
      )}
    </div>
  );
};
