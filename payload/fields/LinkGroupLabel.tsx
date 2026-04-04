'use client';

import { LinkField } from '@/payload-types';
import { useRowLabel } from '@payloadcms/ui';

const LinkGroupLabel = () => {
  const { data } = useRowLabel<{ link: LinkField }>();
  const { link } = data || {};
  const type = link?.type === 'custom' ? 'Custom URL' : 'Internal URL';
  const label = link.label;

  const rowLabel = !label ? 'Empty Link' : `${label} (${type})`;

  // Get the platform name or use a fallback
  return (
    <div style={{ textTransform: 'capitalize' }} className='flex gap-1'>
      {rowLabel}
    </div>
  );
};

export default LinkGroupLabel;
