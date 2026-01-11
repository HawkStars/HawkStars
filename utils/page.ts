import { LinkField } from '@/payload-types';
import { useLanguageCookie } from './contexts/AppProvider';

type LinkInformation = { url: string; newTab?: boolean | null; label?: string | null };

export const getLinkFieldInformation = (link: LinkField): LinkInformation | undefined => {
  if (link.type === 'custom') {
    if (!link.url) return undefined;

    return {
      url: link.url,
      newTab: link.newTab,
      label: link.label,
    };
  }

  if (link.type === 'reference' && link.reference) {
    const lng = useLanguageCookie();
    let href = '#';

    const { relationTo, value: url } = link.reference;
    if (typeof url === 'string')
      href = relationTo === 'pages' ? `/${lng}/${url}` : `/${lng}/events/${url}`;
    else if ('slug' in url && url.slug)
      href = relationTo === 'pages' ? `/${lng}/${url.slug}` : `/${lng}/events/${url.slug}`;

    return {
      url: href,
      newTab: link.newTab,
      label: link.label,
    };
  }

  return undefined;
};
