'use client';

import { LinkField } from '@/payload-types';
import { useRowLabel } from '@payloadcms/ui';

const LinkGroupLabelComponent = ({ rowLabel }: { rowLabel: string }) => {
  return (
    <div style={{ textTransform: 'capitalize' }} className='flex gap-1'>
      {rowLabel}
    </div>
  );
};

const LinkGroupLabel = () => {
  const { data } = useRowLabel<{ link: LinkField }>();
  const { link } = data || {};

  if (!link) return <LinkGroupLabelComponent rowLabel='Empty Link' />;

  const { label } = link;
  const type = link?.type === 'custom' ? 'Custom URL' : 'Internal URL';
  const rowLabel = !label ? 'Empty Link' : `${label} (${type})`;

  return <LinkGroupLabelComponent rowLabel={rowLabel} />;
};

export default LinkGroupLabel;
