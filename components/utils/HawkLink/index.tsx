'use client';
import InternalHawkLink from './InternalHawkLink';
import ExternalHawkLink from './ExternalHawkLink';
import { HawkLink } from './config';

type HawkLinkComponentProps = HawkLink & { className?: string };

export default function HawkLinkComponent({ link, className }: HawkLinkComponentProps) {
  debugger;
  return (
    <>
      {link.type === 'reference' && link.reference ? (
        <InternalHawkLink
          label={link.label}
          relationTo={link.reference.relationTo}
          url={link.reference.value}
          newTab={link.newTab}
          className={className}
        />
      ) : (
        <ExternalHawkLink
          href={link.url}
          newTab={link.newTab}
          label={link.label}
          className={className}
        />
      )}
    </>
  );
}
