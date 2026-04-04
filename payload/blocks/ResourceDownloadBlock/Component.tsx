import React, { FC, ForwardRefExoticComponent, RefAttributes } from 'react';
import { FileText, File, Table, Image as ImageIcon, LucideProps } from 'lucide-react';
import type {
  ResourceDownloadBlock as ResourceDownloadBlockProps,
  HawkDocument,
} from '@/payload-types';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useTranslation } from '@/i18n/client';

const icons = {
  pdf: FileText,
  doc: FileText,
  xls: Table,
  image: ImageIcon,
  other: File,
};

type ResourceItem = {
  icon: ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>;
  file: HawkDocument | null;
  title: string;
  description?: string | null;
};

export const ResourceDownloadBlock: React.FC<ResourceDownloadBlockProps> = ({
  title,
  resources = [],
  variation,
  sectionId,
}) => {
  if (!resources || resources.length === 0) return null;

  return (
    <section className='py-12 lg:py-20' id={sectionId || ''}>
      <div className='container mx-auto'>
        {title && (
          <h2
            className={cn('mb-8 max-w-1/2 text-3xl font-bold text-wrap lg:text-4xl', {
              'text-center': variation === 'card',
              'pb-2 text-left': variation === 'list',
            })}
          >
            {title}
          </h2>
        )}

        <div
          className={cn('flex flex-col space-y-2', {
            'flex flex-col': variation === 'list',
            'grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4': variation === 'card',
          })}
        >
          {resources.map((resource) => {
            const Icon = icons[resource.fileType as keyof typeof icons] || File;
            const file = typeof resource.file === 'string' ? null : (resource.file as HawkDocument);

            return variation === 'card' ? (
              <ResourceCardVariation
                key={resource.id}
                icon={Icon}
                file={file}
                title={resource.title}
                description={resource.description}
              />
            ) : (
              <ResourceListVariation
                key={resource.id}
                icon={Icon}
                file={file}
                title={resource.title}
                description={resource.description}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

const ResourceListVariation: FC<ResourceItem> = ({ icon: Icon, file, title, description }) => {
  return (
    <div className={cn('border-bege-dark flex gap-2 border-b pt-2 pb-4')}>
      {file && (
        <Link href={file?.url || '#'} className='flex cursor-pointer flex-row gap-2 pt-1' download>
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

const ResourceCardVariation: FC<ResourceItem> = ({ icon: Icon, file, title, description }) => {
  const { i18n } = useTranslation('en', 'common');

  return (
    <div className={cn('card-sm card-hover h-full rounded-xl border border-gray-200 p-6')}>
      <h3 className='mb-2 text-xl font-semibold'>{title}</h3>
      {description && <p className='mb-4 text-gray-700'>{description}</p>}
      {file && (
        <Link href={file.url || '#'} className='mt-auto' download>
          {i18n.t('download')}
          <Icon className='h-6 w-6 text-green-600' />
        </Link>
      )}
    </div>
  );
};
