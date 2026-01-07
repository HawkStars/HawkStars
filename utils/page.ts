import { LinkField } from '@/payload-types';

export type LoadingState = 'idle' | 'submitting' | 'success' | 'error';

export const PAGE_SIZE = 10 as const;

export const getLinkFieldInformation = (
  link: LinkField
): { url: string; newTab?: boolean | null; label?: string | null } | undefined => {
  if (link.type === 'reference' && link.reference) {
    let href = '#';

    const { relationTo, value: url } = link.reference;
    if (typeof url === 'string') href = relationTo === 'pages' ? `/${url}` : `/events/${url}`;
    else if ('slug' in url && url.slug)
      href = relationTo === 'pages' ? `/${url.slug}` : `/events/${url.slug}`;

    return {
      url: href,
      newTab: link.newTab,
      label: link.label,
    };
  }
  if (link.type === 'custom' && link.url) {
    return {
      url: link.url,
      newTab: link.newTab,
      label: link.label,
    };
  }
};
