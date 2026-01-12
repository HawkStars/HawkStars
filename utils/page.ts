import { LinkField } from '@/payload-types';
import { Language } from '@/i18n/settings';

type LinkInformation = {
  url: string;
  newTab?: boolean | null;
  label?: string | null;
  internal?: boolean;
};

export const getLinkFieldInformation = (
  link: LinkField,
  lng: Language
): LinkInformation | undefined => {
  if (link.type === 'custom') {
    if (!link.url) return undefined;

    return {
      url: link.url.startsWith('/') ? `/${lng}${link.url}` : link.url,
      newTab: link.newTab,
      label: link.label,
      internal: false,
    };
  }

  if (link.type === 'reference' && link.reference) {
    let href = '#';

    const { section } = link;
    const { relationTo, value: url } = link.reference;

    if (typeof url === 'string')
      href =
        relationTo === 'pages'
          ? `/${lng}/${url}${section ? `#${section}` : ''}`
          : `/${lng}/events/${url}${section ? `#${section}` : ''}`;
    else if ('slug' in url && url.slug)
      href =
        relationTo === 'pages'
          ? `/${lng}/${url.slug}${section ? `#${section}` : ''}`
          : `/${lng}/events/${url.slug}${section ? `#${section}` : ''}`;

    return {
      url: href,
      newTab: link.newTab,
      label: link.label,
      internal: true,
    };
  }

  return undefined;
};
