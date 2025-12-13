import { ExternalLinkProps } from './config';

const ExternalHawkLink = ({ href, newTab, children, className }: ExternalLinkProps) => {
  if (!href) return null;

  return (
    <a
      type='button'
      className={`text-terciary-300 hover:text-terciary-100 p-0 transition-colors duration-200 ${className ?? ''}`}
      target={newTab ? '_blank' : '_self'}
      href={href}
    >
      {children}
    </a>
  );
};

export default ExternalHawkLink;
