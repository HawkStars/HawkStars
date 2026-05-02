'use client';

import { useRowLabel } from '@payloadcms/ui';

const ReportsRowLabel = () => {
  const { data } = useRowLabel<{
    platform: string;
    label: string;
  }>();

  const rowLabel = `${data?.platform || ''} ${data?.label || 'Unnamed Report'}`;

  return <div style={{ textTransform: 'capitalize' }}>{rowLabel}</div>;
};

export default ReportsRowLabel;
