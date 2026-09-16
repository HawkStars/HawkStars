import { Button, buttonVariants } from '@/components/ui/button';
import type { VariantProps } from 'class-variance-authority';
import Link from 'next/link';
import React from 'react';

import type { HawkProject, Page } from '@/payload-types';
import { cn } from '@/lib/utils';
import { createUrlByCollection, isHttpUrl } from '@/utils/paths';
import { Language } from '@/i18n/settings';

type ButtonProps = VariantProps<typeof buttonVariants>;

type CMSLinkType = {
  appearance?: 'inline' | ButtonProps['variant'];
  children?: React.ReactNode;
  className?: string;
  label?: string | null;
  newTab?: boolean | null;
  reference?: {
    relationTo: 'pages' | 'hawk_projects';
    value: Page | HawkProject | string | number;
  } | null;
  size?: ButtonProps['size'] | null;
  type?: 'custom' | 'reference' | null;
  url?: string | null;
  lng: Language;
};

export const CMSLink: React.FC<CMSLinkType> = (props) => {
  const {
    type,
    appearance = 'inline',
    children,
    className,
    label,
    newTab,
    reference,
    size: sizeFromProps,
    url,
    lng,
  } = props;

  let href: string | null | undefined;

  if (type === 'reference' && reference) {
    const slug =
      typeof reference.value === 'object' && reference.value.slug
        ? reference.value.slug
        : typeof reference.value === 'string'
          ? reference.value
          : undefined;

    href = slug ? createUrlByCollection(reference.relationTo, lng, slug) : undefined;
  } else {
    href = url?.startsWith('/') ? `/${lng}${url}` : url;
  }

  if (!href) return null;

  // Custom URLs are editor-supplied free text; `javascript:` here would execute
  // same-origin. Site-relative and in-page links are fine.
  if (!href.startsWith('/') && !href.startsWith('#') && !isHttpUrl(href)) return null;

  const size = appearance === 'link' ? 'clear' : sizeFromProps;
  const newTabProps = newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {};

  /* Ensure we don't break any styles set by richText */
  if (appearance === 'inline') {
    return (
      <Link className={cn(className)} href={href} {...newTabProps}>
        {label && label}
        {children && children}
      </Link>
    );
  }

  return (
    <Button asChild className={className} size={size} variant={appearance}>
      <Link className={cn(className)} href={href} {...newTabProps}>
        {label && label}
        {children && children}
      </Link>
    </Button>
  );
};
