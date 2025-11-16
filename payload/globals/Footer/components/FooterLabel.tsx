'use client';

import { useRowLabel } from '@payloadcms/ui';

export const FooterLabel = () => {
  const { data } = useRowLabel<{ column: { title?: string } }>();
  const title = data?.column?.title;

  // Get the platform name or use a fallback
  return <div style={{ textTransform: 'capitalize' }}>{title || 'Menu'}</div>;
};
