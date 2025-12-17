'use client';

import { useRowLabel } from '@payloadcms/ui';

const HeaderLabel = () => {
  const { data } = useRowLabel<{
    title: string;
  }>();

  // Get the platform name or use a fallback
  return <div style={{ textTransform: 'capitalize' }}>{data?.title || 'Menu'}</div>;
};

export default HeaderLabel;
