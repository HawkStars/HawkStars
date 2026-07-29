'use client';

import { makeRowLabel } from './makeRowLabel';

const DiscoverEuStopRowLabel = makeRowLabel({
  fallback: 'Unnamed stop',
  getTitle: (data) => data?.city,
});

export default DiscoverEuStopRowLabel;
