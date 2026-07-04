'use client';

import { useRowLabel } from '@payloadcms/ui';

const ReportsRowLabel = () => {
  const { data, rowNumber } = useRowLabel<{
    platform: string;
    label: string;
  }>();

  const rowLabel = `${data?.platform || ' - '} ${data?.label || `Report ${rowNumber ?? 0 + 1}`}`;

  return <div style={{ textTransform: 'capitalize' }}>{rowLabel}</div>;
};

export default ReportsRowLabel;
