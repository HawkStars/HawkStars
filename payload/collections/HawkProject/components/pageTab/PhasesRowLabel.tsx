'use client';

import { useRowLabel } from '@payloadcms/ui';

const PhasesRowLabel = () => {
  const { data } = useRowLabel<{
    title?: string;
  }>();

  return <div style={{ textTransform: 'capitalize' }}>{data?.title || 'Unnamed phase'}</div>;
};

export default PhasesRowLabel;
