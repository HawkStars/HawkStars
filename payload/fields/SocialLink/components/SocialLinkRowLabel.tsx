'use client';

import { useRowLabel } from '@payloadcms/ui';

export const SocialLinkRowLabel = () => {
  const { data, rowNumber } = useRowLabel<{
    platform?: string;
  }>();
  debugger;

  // Get the platform name or use a fallback
  const platformName = data.platform || 'Social Link';

  return <div>{platformName}</div>;
};
