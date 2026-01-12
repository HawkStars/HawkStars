import Link from 'next/link';
import { InternalLinkProps } from './config';
import { cn } from '@/lib/utils';
import { useLanguageCookie } from '@/utils/contexts/AppProvider';

const InternalHawkLink = ({
  children,
  relationTo,
  url,
  newTab,
  className,
  section,
}: InternalLinkProps) => {
  const lng = useLanguageCookie();
  let href = '#';
  if (typeof url === 'string')
    href =
      relationTo === 'pages'
        ? `/${lng}/${url}${section ? `#${section}` : ''}`
        : `/events/${lng}/${url}${section ? `#${section}` : ''}`;
  else if ('slug' in url && url.slug)
    href =
      relationTo === 'pages'
        ? `/${lng}/${url.slug}${section ? `#${section}` : ''}`
        : `/events/${lng}/${url.slug}${section ? `#${section}` : ''}`;

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
