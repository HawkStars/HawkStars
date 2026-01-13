'use client';

import { useRowLabel } from '@payloadcms/ui';

type LinkLabelProps = {
  link?: {
    label: string;
  };
};

const LinkLabel = () => {
  const { data } = useRowLabel<LinkLabelProps>();

  return <div style={{ textTransform: 'capitalize' }}>Link - {data?.link?.label}</div>;
};

export default LinkLabel;
