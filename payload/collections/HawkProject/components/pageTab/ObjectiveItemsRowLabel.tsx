'use client';

import { useRowLabel } from '@payloadcms/ui';

const ObjectiveItemsRowLabel = () => {
  const { data } = useRowLabel<{
    text?: string;
  }>();

  const rowLabel = data?.text?.trim();
  return <div>{rowLabel || 'Unnamed objective'}</div>;
};

export default ObjectiveItemsRowLabel;
