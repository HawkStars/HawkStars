import { LinkField } from '@/payload-types';
import { Language } from '@/i18n/settings';
import { createUrlByCollection } from './paths';

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

    // A site-relative path is an in-app route: prefix the locale and let callers use
    // next/link for it (client-side navigation) instead of a full page reload.
    const relative = link.url.startsWith('/');
    const anchor = relative && link.section && !link.url.includes('#') ? `#${link.section}` : '';
    return {
      url: relative ? `/${lng}${link.url}${anchor}` : link.url,
      newTab: link.newTab,
      label: link.label?.trim(),
      internal: relative,
    };
  }

  if (link.type === 'reference' && link.reference) {
    let href = '#';

    const { section } = link;
    const { relationTo, value: url } = link.reference;

    if (typeof url === 'string') href = createUrlByCollection(relationTo, lng, url, section);
    else if ('slug' in url && url.slug)
      href = createUrlByCollection(relationTo, lng, url.slug, section);

    return {
      url: href,
      newTab: link.newTab,
      label: link.label?.trim(),
      internal: true,
    };
  }

  return undefined;
};
