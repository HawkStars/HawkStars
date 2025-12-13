'use client';
import InternalHawkLink from './InternalHawkLink';
import ExternalHawkLink from './ExternalHawkLink';
import { HawkLink } from './config';

type HawkLinkComponentProps = HawkLink & { className?: string; children?: React.ReactNode };

export default function HawkLinkComponent({ link, className, children }: HawkLinkComponentProps) {
  return (
    <>
      {link.type === 'reference' && link.reference ? (
        <InternalHawkLink
          relationTo={link.reference.relationTo}
          url={link.reference.value}
          newTab={link.newTab}
          className={className}
        >
          {children ?? link.label}
        </InternalHawkLink>
      ) : (
        <ExternalHawkLink href={link.url} newTab={link.newTab} className={className}>
          {children ?? link.label}
        </ExternalHawkLink>
      )}
    </>
  );
}
