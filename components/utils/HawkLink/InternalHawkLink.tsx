import Link from 'next/link';
import { InternalLinkProps } from './config';
import { cn } from '@/lib/utils';
import { useLanguageCookie } from '@/utils/contexts/AppProvider';
import { HawkEvent, HawkProject, Page } from '@/payload-types';

type UrlType = string | Page | HawkProject | HawkEvent;

export const createInternalLinkHref = (
  relationTo: string,
  url: UrlType,
  section?: string | null
) => {
  const lng = useLanguageCookie();
  let href = '#';

  const transformedUrl = `${typeof url === 'string' ? url : url.slug}${section ? `#${section}` : ''}`;

  switch (relationTo) {
    case 'pages':
      href = `/${lng}/${transformedUrl}`;
      break;
    case 'hawk_events':
      href = `/${lng}/events/${transformedUrl}`;
      break;
    case 'hawk_projects':
      href = `/${lng}/projects/${transformedUrl}`;
      break;
    default:
      break;
  }
  return href;
};

const InternalHawkLink = ({
  children,
  relationTo,
  url,
  newTab,
  className,
  section,
}: InternalLinkProps) => {
  const href = createInternalLinkHref(relationTo, url, section);

  return (
    <Link
      href={href}
      target={newTab ? '_blank' : '_self'}
      className={cn(
        'text-terciary-300 hover:text-terciary-100',
        'transition-colors duration-200',
        className
      )}
    >
      {children}
    </Link>
  );
};

export default InternalHawkLink;
