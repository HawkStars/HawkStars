'use client';

import { useRowLabel } from '@payloadcms/ui';

const DisseminationReportsRowLabel = () => {
  const { data } = useRowLabel<{
    label?: string;
  }>();

  return <div>{data?.label?.trim() || 'Unnamed report'}</div>;
};

export default DisseminationReportsRowLabel;
