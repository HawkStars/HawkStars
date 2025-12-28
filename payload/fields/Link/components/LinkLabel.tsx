'use client';

import { useRowLabel } from '@payloadcms/ui';

const LinkLabel = () => {
  const { data } = useRowLabel<{ label: string }>();

  return <div style={{ textTransform: 'capitalize' }}>{data?.label || 'Link'}</div>;
};

export default LinkLabel;
