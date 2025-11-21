'use client';
import InternalHawkLink from './InternalHawkLink';
import ExternalHawkLink from './ExternalHawkLink';
import { HawkLink } from './config';

export default function HawkLinkComponent({ link }: HawkLink) {
  return (
    <>
      {link.type === 'reference' && link.reference ? (
        <InternalHawkLink
          label={link.label}
          relationTo={link.reference.relationTo}
          url={link.reference.value}
          newTab={link.newTab}
        />
      ) : (
        <ExternalHawkLink href={link.url} newTab={link.newTab} label={link.label} />
      )}
    </>
  );
}
