import { Page, HawkProject, LinkField } from '@/payload-types';

export type ExternalLinkProps = {
  children: string | React.ReactNode;
  href: string | undefined | null;
  newTab: boolean | null | undefined;
  className?: string;
  section?: string | null | undefined;
};

export type InternalLinkProps = Pick<
  ExternalLinkProps,
  'children' | 'newTab' | 'className' | 'section'
> & {
  relationTo: string;
  url: string | Page | HawkProject;
};

export type HawkLink = {
  link: LinkField;
  id?: string | null;
  visible?: boolean | null | undefined;
};
