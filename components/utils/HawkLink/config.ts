import { Page, HawkProject, LinkField } from '@/payload-types';

export type ExternalLinkProps = {
  label: string;
  href: string | undefined | null;
  newTab: boolean | null | undefined;
  className?: string;
};

export type InternalLinkProps = Pick<ExternalLinkProps, 'label' | 'newTab' | 'className'> & {
  relationTo: string;
  url: string | Page | HawkProject;
};

export type HawkLink = {
  link: LinkField;
  id?: string | null;
};
