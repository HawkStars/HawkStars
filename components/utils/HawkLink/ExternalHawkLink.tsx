import { useLanguageCookie } from '@/utils/contexts/AppProvider';
import { ExternalLinkProps } from './config';
import { isHttpUrl } from '@/utils/paths';

const ExternalHawkLink = ({ href, newTab, children, className, section }: ExternalLinkProps) => {
  const lng = useLanguageCookie();
  if (!href) return null;

  // Defence in depth: the field validators reject non-http(s) URLs, but documents
  // written before they existed — or through the Local API, which skips validation —
  // can still carry one. Rendering `javascript:` here executes same-origin.
  if (!href.startsWith('/') && !href.startsWith('#') && !isHttpUrl(href)) return null;

  let hrefWithSection;
  if (href.startsWith('/')) {
    const localizedHref = `/${lng}${href}`;
    hrefWithSection = section ? `${localizedHref}#${section}` : localizedHref;
  }

  return (
    <a
      className={`p-0 transition-colors duration-200 ${className ?? ''}`}
      target={newTab ? '_blank' : '_self'}
      rel={newTab ? 'noopener noreferrer' : undefined}
      href={hrefWithSection || href}
    >
      {children}
    </a>
  );
};

export default ExternalHawkLink;
