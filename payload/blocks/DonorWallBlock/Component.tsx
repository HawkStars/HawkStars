import React, { useMemo } from 'react';
import Image from 'next/image';
import { Award, Heart } from 'lucide-react';
import type { DonorWallBlock as DonorWallBlockProps, Media } from '@/payload-types';
import { cn } from '@/lib/utils';

export const DonorWallBlock: React.FC<DonorWallBlockProps> = ({
  title,
  subtitle,
  donors = [],
  layout = 'grid',
  showAmounts = false,
  sortBy = 'level',
}) => {
  const levelOrder = { platinum: 1, gold: 2, silver: 3, bronze: 4, supporter: 5 };

  const sortedDonors = useMemo(() => {
    if (!donors || donors.length === 0) return [];

    const sorted = [...donors];

    if (sortBy === 'amount-desc') {
      sorted.sort((a, b) => (b.amount || 0) - (a.amount || 0));
    } else if (sortBy === 'level') {
      sorted.sort((a, b) => {
        const levelA = levelOrder[a.level as keyof typeof levelOrder] || 99;
        const levelB = levelOrder[b.level as keyof typeof levelOrder] || 99;
        return levelA - levelB;
      });
    } else if (sortBy === 'name') {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    }

    return sorted;
  }, [donors, sortBy, levelOrder]);

  const levelColors = {
    platinum: 'from-gray-400 to-gray-200',
    gold: 'from-bege-dark to-bege-light',
    silver: 'from-gray-400 to-gray-200',
    bronze: 'from-bege-dark to-bege-light',
    supporter: 'from-green to-bege-light',
  };

  const levelTextColors = {
    platinum: 'text-gray-700',
    gold: 'text-black',
    silver: 'text-gray-700',
    bronze: 'text-black',
    supporter: 'text-green',
  };

  if (!sortedDonors || sortedDonors.length === 0) {
    return null;
  }

  return (
    <section className='py-12 lg:py-20'>
      <div className='container mx-auto'>
        {/* Header */}
        <div className='mb-12 text-center'>
          <div className='bg-bege-light mb-4 inline-flex rounded-full p-3'>
            <Heart className='text-green h-6 w-6' />
          </div>
          <h2 className='mb-4 text-3xl font-bold lg:text-4xl'>{title}</h2>
          {subtitle && <p className='mx-auto max-w-2xl text-lg text-gray-600'>{subtitle}</p>}
        </div>

        {/* Donor Display */}
        {layout === 'wall' && (
          <div className='flex flex-wrap justify-center gap-4'>
            {sortedDonors.map((donor, index) => (
              <div
                key={index}
                className={cn(
                  'card-md rounded-full px-6 py-3 font-semibold',
                  'bg-gradient-to-r',
                  levelColors[donor.level as keyof typeof levelColors] || levelColors.supporter
                )}
              >
                <span className={levelTextColors[donor.level as keyof typeof levelTextColors]}>
                  {donor.name}
                </span>
              </div>
            ))}
          </div>
        )}

        {layout === 'grid' && (
          <div className='grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4'>
            {sortedDonors.map((donor, index) => (
              <div
                key={index}
                className='card-sm card-hover flex flex-col items-center border border-gray-200 p-6 text-center'
              >
                {donor.logo && typeof donor.logo !== 'string' && (
                  <div className='relative mb-4 h-16 w-16'>
                    <Image
                      src={(donor.logo as Media).url || ''}
                      alt={donor.name}
                      fill
                      className='object-contain'
                    />
                  </div>
                )}
                {!donor.logo && donor.level && (
                  <Award
                    className={cn(
                      'mb-4 h-10 w-10',
                      levelTextColors[donor.level as keyof typeof levelTextColors]
                    )}
                  />
                )}
                <div className='font-semibold'>{donor.name}</div>
                {donor.level && (
                  <div
                    className={cn(
                      'mt-2 text-xs tracking-wide uppercase',
                      levelTextColors[donor.level as keyof typeof levelTextColors]
                    )}
                  >
                    {donor.level}
                  </div>
                )}
                {showAmounts && donor.amount && (
                  <div className='mt-2 text-sm text-gray-600'>
                    {donor.currency}
                    {donor.amount.toLocaleString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {layout === 'cards' && (
          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {sortedDonors.map((donor, index) => (
              <div key={index} className='card-md card-hover-lg border border-gray-200 p-6'>
                <div className='flex items-start gap-4'>
                  {donor.logo && typeof donor.logo !== 'string' && (
                    <div className='relative h-16 w-16 shrink-0'>
                      <Image
                        src={(donor.logo as Media).url || ''}
                        alt={donor.name}
                        fill
                        className='object-contain'
                      />
                    </div>
                  )}
                  <div className='flex-1'>
                    <h3 className='mb-1 text-lg font-semibold'>{donor.name}</h3>
                    {donor.level && (
                      <span
                        className={cn(
                          'inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase',
                          'bg-gradient-to-r',
                          levelColors[donor.level as keyof typeof levelColors]
                        )}
                      >
                        {donor.level}
                      </span>
                    )}
                    {showAmounts && donor.amount && (
                      <div className='mt-2 text-sm font-medium text-gray-700'>
                        {donor.currency}
                        {donor.amount.toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
                {donor.message && (
                  <p className='mt-4 text-gray-600 italic'>&ldquo;{donor.message}&rdquo;</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
