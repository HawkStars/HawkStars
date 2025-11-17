'use client';
import Link from 'next/link';
import { ReactNode } from 'react';

interface HawkLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  internal?: boolean;
  target?: string;
  rel?: string;
}

export default function HawkLink({
  href,
  children,
  className,
  internal = false,
  target,
  rel,
  ...props
}: HawkLinkProps) {
  // Auto-detect internal links if not explicitly specified
  const isInternal = internal || href.startsWith('/') || href.startsWith('#');

  if (isInternal) {
    return (
      <Link href={href} className={className} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <a
      href={href}
      className={className}
      target={target || '_blank'}
      rel={rel || 'noopener noreferrer'}
      {...props}
    >
      {children}
    </a>
  );
}
