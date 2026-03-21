import React from 'react';
import type { SponsorsBlock as SponsorsBlockProps, Media } from '@/payload-types';
import type { Where } from 'payload';
import { getPayloadConfig } from '@/lib/payload/server';
import { SponsorsBlockView, type SponsorItem } from './SponsorsBlockView';

export const SponsorsBlock: React.FC<SponsorsBlockProps> = async ({
  title,
  subtitle,
  tier,
  limit = 12,
  sectionId,
}) => {
  const payload = await getPayloadConfig();

  const where: Where = {};

  if (tier && tier.length > 0) {
    where.tier = { in: tier };
  }

  const result = await payload.find({
    collection: 'sponsors',
    where,
    limit: limit ?? 12,
    sort: 'name',
  });

  const sponsors = result.docs;

  if (!sponsors || sponsors.length === 0) {
    return null;
  }

  const items: SponsorItem[] = sponsors.map((s) => {
    const logo = s.logo as Media | undefined;
    return {
      id: s.id,
      name: s.name,
      logo: logo ? { url: logo.url } : null,
      website: s.website,
      tier: s.tier,
    };
  });

  return (
    <SponsorsBlockView
      title={title}
      subtitle={subtitle}
      sectionId={sectionId}
      sponsors={items}
    />
  );
};
