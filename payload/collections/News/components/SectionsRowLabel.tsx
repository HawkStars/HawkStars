'use client';

import { useRowLabel } from '@payloadcms/ui';

const SectionsRowLabel = () => {
  const { data } = useRowLabel<{
    title?: string;
  }>();

  return <div style={{ textTransform: 'capitalize' }}>{data?.title || 'Unnamed section'}</div>;
};

export default SectionsRowLabel;
