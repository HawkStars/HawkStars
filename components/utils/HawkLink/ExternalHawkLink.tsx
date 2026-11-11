import Link from 'next/link';
import { useLanguageCookie } from '@/utils/contexts/AppProvider';
import { ExternalLinkProps } from './config';
import { isLinkUrl } from '@/utils/paths';

const ExternalHawkLink = ({ href, newTab, children, className, section }: ExternalLinkProps) => {
  const lng = useLanguageCookie();
  if (!href) return null;

  // Defence in depth: the field validators reject other schemes (see isLinkUrl), but documents
  // written before they existed — or through the Local API, which skips validation —
  // can still carry one. Rendering `javascript:` here executes same-origin.
  if (!href.startsWith('/') && !href.startsWith('#') && !isLinkUrl(href)) return null;

  const linkClassName = `p-0 transition-colors duration-200 ${className ?? ''}`;

  // Site-relative path: localize it and navigate client-side.
  if (href.startsWith('/')) {
    const localizedHref = `/${lng}${href}`;
    return (
      <Link
        className={linkClassName}
        target={newTab ? '_blank' : undefined}
        rel={newTab ? 'noopener noreferrer' : undefined}
        href={section && !href.includes('#') ? `${localizedHref}#${section}` : localizedHref}
      >
        {children}
      </Link>
    );
  }

  return (
    <a
      className={linkClassName}
      target={newTab ? '_blank' : '_self'}
      rel={newTab ? 'noopener noreferrer' : undefined}
      href={href}
    >
      {children}
    </a>
  );
};

export default ExternalHawkLink;
