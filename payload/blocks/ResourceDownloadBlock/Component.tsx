import React from 'react';
import { Download, FileText, File, Table, Image as ImageIcon } from 'lucide-react';
import type { ResourceDownloadBlock as ResourceDownloadBlockProps, Media } from '@/payload-types';
import { Button } from '@/components/ui/button';

export const ResourceDownloadBlock: React.FC<ResourceDownloadBlockProps> = ({
  title,
  resources = [],
  sectionId,
}) => {
  const icons = {
    pdf: FileText,
    doc: FileText,
    xls: Table,
    image: ImageIcon,
    other: File,
  };

  if (!resources || resources.length === 0) {
    return null;
  }

  return (
    <section className='py-12 lg:py-20' id={sectionId || ''}>
      <div className='container mx-auto'>
        {title && <h2 className='mb-12 text-center text-3xl font-bold lg:text-4xl'>{title}</h2>}

        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {resources.map((resource, index) => {
            const Icon = icons[resource.fileType as keyof typeof icons] || File;
            const file = typeof resource.file === 'string' ? null : (resource.file as Media);

            return (
              <div key={index} className='card-sm card-hover rounded-xl border border-gray-200 p-6'>
                <div className='mb-4 inline-flex rounded-full bg-green-100 p-3'>
                  <Icon className='h-6 w-6 text-green-600' />
                </div>
                <h3 className='mb-2 text-xl font-semibold'>{resource.title}</h3>
                {resource.description && (
                  <p className='mb-4 text-gray-700'>{resource.description}</p>
                )}
                {file && (
                  <Button size='sm' className='w-full' asChild>
                    <a href={file.url || '#'} download>
                      <Download className='mr-2 h-4 w-4' />
                      Download
                    </a>
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
