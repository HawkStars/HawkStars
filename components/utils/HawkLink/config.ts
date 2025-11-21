import { Page, HawkEvent } from '@/payload-types';

type LinkProps = {
  type?: 'reference' | 'custom' | null | undefined;
  newTab?: boolean | null | undefined;
  reference?:
    | {
        relationTo: 'pages';
        value: string | Page;
      }
    | {
        relationTo: 'hawk_events';
        value: string | HawkEvent;
      }
    | null
    | undefined;
  url?: string | null;
  label: string;
  appearance?: ('default' | 'outline') | null;
};

export type ExternalLinkProps = {
  label: string;
  href: string | undefined | null;
  newTab: boolean | null | undefined;
};

export type InternalLinkProps = Pick<ExternalLinkProps, 'label' | 'newTab'> & {
  relationTo: string;
  url: string | Page | HawkEvent;
};

export type HawkLink = {
  link: LinkProps;
  id?: string | null;
};
