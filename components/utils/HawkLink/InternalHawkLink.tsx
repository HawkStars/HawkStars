import Link from 'next/link';
import { InternalLinkProps } from './config';
import { cn } from '@/lib/utils';

const InternalHawkLink = ({ children, relationTo, url, newTab, className }: InternalLinkProps) => {
  let href = '#';
  if (typeof url === 'string') href = relationTo === 'pages' ? `/${url}` : `/events/${url}`;
  else if ('slug' in url && url.slug)
    href = relationTo === 'pages' ? `/${url.slug}` : `/events/${url.slug}`;

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
