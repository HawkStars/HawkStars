import classNames from 'classnames';
import Link from 'next/link';
import { InternalLinkProps } from './config';

const InternalHawkLink = ({ label, relationTo, url, newTab }: InternalLinkProps) => {
  let href = '#';
  if (typeof url === 'string') href = relationTo === 'pages' ? `/${url}` : `/events/${url}`;
  else if ('slug' in url && url.slug)
    href = relationTo === 'pages' ? `/${url.slug}` : `/events/${url.slug}`;

  return (
    <Link
      href={href}
      target={newTab ? '_blank' : '_self'}
      className={classNames(
        'text-terciary-300 hover:text-terciary-100',
        'transition-colors duration-200'
      )}
    >
      {label}
    </Link>
  );
};

export default InternalHawkLink;
