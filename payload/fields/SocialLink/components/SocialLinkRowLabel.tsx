'use client';

import { useRowLabel } from '@payloadcms/ui';

export const SocialLinkRowLabel = () => {
  const { data } = useRowLabel<{
    platform?: string;
  }>();

  // Get the platform name or use a fallback
  const platformName = data.platform || 'Social Link';

  return <div style={{ textTransform: 'capitalize' }}>{platformName}</div>;
};
