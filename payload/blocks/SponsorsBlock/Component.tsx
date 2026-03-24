import React, { FC, useCallback, useEffect, useState } from 'react';
import { stringify } from 'qs-esm';
import type { SponsorsBlock as SponsorsBlockProps, Sponsor, Media } from '@/payload-types';
import type { PaginatedDocs, Where } from 'payload';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export const SponsorsBlock: React.FC<SponsorsBlockProps> = ({
  title,
  subtitle,
  tier,
  limit = 12,
  sectionId,
}) => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);

  const getSponsors = useCallback(async () => {
    const where: Where = {};
    if (tier && tier.length > 0) where.tier = { in: tier };

    try {
      const stringifiedQuery = stringify(where, { addQueryPrefix: true });
      const response = await fetch(`/api/sponsors${stringifiedQuery}`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch sponsors: ${response.statusText}`);
      }

      const data: PaginatedDocs<Sponsor> = await response.json();
      setSponsors(data.docs || []);
    } catch (error) {
      console.error('Error fetching sponsors:', error);
    }
  }, [tier, limit]);

  useEffect(() => {
    getSponsors();
  }, [getSponsors]);

  if (!sponsors || sponsors.length === 0) return null;

  const groupByTier: Record<string, Sponsor[]> = sponsors.reduce(
    (acc, sponsor) => {
      const sponsorTier = sponsor.tier || 'Uncategorized';
      if (!acc[sponsorTier]) {
        acc[sponsorTier] = [];
      }
      acc[sponsorTier].push(sponsor);
      return acc;
    },
    {} as Record<string, Sponsor[]>
  );

  const evenTiers: string[] = Object.keys(groupByTier).filter((_, index) => index % 2 === 0);
  const oddTiers: string[] = Object.keys(groupByTier).filter((_, index) => index % 2 !== 0);

  return (
    <section className='max-w-7xl py-12 lg:mx-auto lg:py-20' id={sectionId || ''}>
      <div className='container mx-auto'>
        {(title || subtitle) && (
          <div className='mb-10 text-center'>
            {title && <h2 className='text-h1_semibold text-green'>{title || 'Sponsors'}</h2>}
            {subtitle && <p className='mx-auto mt-5 max-w-2xl text-lg text-gray-600'>{subtitle}</p>}
          </div>
        )}

        <div className='grid grid-cols-2 items-start gap-6'>
          <div className='flex flex-col gap-4'>
            {oddTiers.map((tier) => (
              <LogosContainer key={tier} tier={tier} sponsors={groupByTier[tier]} />
            ))}
          </div>
          <div className='mt-20 flex flex-col gap-4'>
            {evenTiers.map((tier) => (
              <LogosContainer key={tier} tier={tier} sponsors={groupByTier[tier]} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

type LogosContainerProps = {
  tier: string;
  sponsors: Sponsor[];
};

const LogosContainer: FC<LogosContainerProps> = ({ tier, sponsors }) => {
  return (
    <div className={cn('bg-green relative min-h-90 rounded-3xl p-4')}>
      <h3 className='text-h2_bold text-bege-dark absolute top-4 left-5'>{tier}</h3>
      <div className='flex flex-wrap gap-6'>
        {sponsors.map((sponsor) => {
          const logoUrl = (sponsor.logo as Media)?.url;

          return (
            <div
              key={sponsor.id}
              className={`flex flex-col items-center justify-center gap-3 rounded-3xl px-6 pt-10 pb-6 text-white`}
            >
              {logoUrl ? (
                <div className='relative mb-3 h-24 w-full'>
                  <Image src={logoUrl} alt={sponsor.name} fill className='object-contain' />
                </div>
              ) : (
                <div className='mb-3 flex h-16 w-full items-center justify-center rounded bg-gray-100'>
                  <span className='text-sm font-medium'>{sponsor.name.charAt(0)}</span>
                </div>
              )}
              <span className='text-center text-sm font-medium'>{sponsor.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
