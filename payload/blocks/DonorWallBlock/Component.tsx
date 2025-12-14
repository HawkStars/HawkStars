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
  }, [donors, sortBy]);

  const levelColors = {
    platinum: 'from-slate-400 to-slate-200',
    gold: 'from-yellow-400 to-yellow-200',
    silver: 'from-gray-400 to-gray-200',
    bronze: 'from-orange-400 to-orange-300',
    supporter: 'from-blue-400 to-blue-200',
  };

  const levelTextColors = {
    platinum: 'text-slate-700',
    gold: 'text-yellow-700',
    silver: 'text-gray-700',
    bronze: 'text-orange-700',
    supporter: 'text-blue-700',
  };

  if (!sortedDonors || sortedDonors.length === 0) {
    return null;
  }

  return (
    <section className='py-12 lg:py-20'>
      <div className='container mx-auto'>
        {/* Header */}
        <div className='mb-12 text-center'>
          <div className='mb-4 inline-flex rounded-full bg-red-100 p-3'>
            <Heart className='h-6 w-6 text-red-600' />
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
                  'rounded-full px-6 py-3 font-semibold shadow-md',
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
                className='flex flex-col items-center rounded-lg border border-gray-200 bg-white p-6 text-center shadow-sm transition-shadow hover:shadow-md'
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
              <div
                key={index}
                className='rounded-xl border border-gray-200 bg-white p-6 shadow-md transition-shadow hover:shadow-lg'
              >
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
