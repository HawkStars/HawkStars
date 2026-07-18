'use client';

import { makeRowLabel } from '@/payload/components/admin/makeRowLabel';

const ObjectiveItemsRowLabel = makeRowLabel({
  fallback: 'Unnamed objective',
  getTitle: (data) => data.text,
  capitalize: false,
});

export default ObjectiveItemsRowLabel;
