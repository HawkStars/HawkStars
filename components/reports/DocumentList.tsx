import { LuDownload, LuFileText } from 'react-icons/lu';
import type { HawkDocument } from '@/payload-types';
import { cn } from '@/lib/utils';

export type DocumentListItem = {
  key: string;
  label: string;
  /** A populated document, an unpopulated id, or nothing yet. */
  document?: HawkDocument | string | null;
};

type DocumentListProps = {
  items: DocumentListItem[];
  downloadLabel: string;
  unavailableLabel: string;
  className?: string;
};

const formatSize = (bytes?: number | null) => {
  if (!bytes) return null;
  return bytes > 1024 * 1024
    ? `${(bytes / 1024 / 1024).toFixed(1)} MB`
    : `${Math.round(bytes / 1024)} KB`;
};

const fileType = (doc: HawkDocument) =>
  doc.mimeType?.split('/').pop()?.toUpperCase() ?? doc.filename?.split('.').pop()?.toUpperCase();

/**
 * Official documents as download rows. Items without a (populated) file stay listed as
 * "coming soon", so a year's set reads as complete even before every PDF is uploaded.
 */
export const DocumentList = ({
  items,
  downloadLabel,
  unavailableLabel,
  className,
}: DocumentListProps) => (
  <ul
    className={cn(
      'border-bege-dark divide-bege-dark divide-y rounded-xl border bg-white',
      className
    )}
  >
    {items.map(({ key, label, document }) => {
      const doc = document && typeof document === 'object' && document.url ? document : null;
      const meta = doc
        ? [fileType(doc), formatSize(doc.filesize)].filter(Boolean).join(' · ')
        : null;

      return (
        <li key={key}>
          {doc ? (
            <a
              href={doc.url ?? undefined}
              target='_blank'
              rel='noopener noreferrer'
              className='hover:bg-bege-light group flex items-center gap-4 px-5 py-4 transition-colors'
            >
              <span className='bg-green/10 text-green flex size-10 shrink-0 items-center justify-center rounded-lg'>
                <LuFileText aria-hidden='true' className='size-5' />
              </span>
              <span className='flex-1'>
                <span className='text-body_semibold group-hover:text-green block'>{label}</span>
                {meta && <span className='text-xs text-black/60'>{meta}</span>}
              </span>
              <span className='text-green flex items-center gap-1.5 text-sm font-semibold'>
                <LuDownload aria-hidden='true' className='size-4' />
                <span className='sr-only sm:not-sr-only'>{downloadLabel}</span>
              </span>
            </a>
          ) : (
            <div className='flex items-center gap-4 px-5 py-4 text-black/50'>
              <span className='bg-bege-light flex size-10 shrink-0 items-center justify-center rounded-lg'>
                <LuFileText aria-hidden='true' className='size-5' />
              </span>
              <span className='text-body_semibold flex-1'>{label}</span>
              <span className='text-xs font-semibold uppercase'>{unavailableLabel}</span>
            </div>
          )}
        </li>
      );
    })}
  </ul>
);
