import { useLanguageCookie } from '@/utils/contexts/AppProvider';
import { ExternalLinkProps } from './config';

const ExternalHawkLink = ({ href, newTab, children, className, section }: ExternalLinkProps) => {
  const lng = useLanguageCookie();
  if (!href) return null;

  let hrefWithSection;
  if (href.startsWith('/')) {
    const localizedHref = `/${lng}${href}`;
    hrefWithSection = section ? `${localizedHref}#${section}` : localizedHref;
  }

  return (
    <a
      type='button'
      className={`text-terciary-300 hover:text-terciary-100 p-0 transition-colors duration-200 ${className ?? ''}`}
      target={newTab ? '_blank' : '_self'}
      href={hrefWithSection || href}
    >
      {children}
    </a>
  );
};

export default ExternalHawkLink;
