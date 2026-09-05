'use client';

import React from 'react';
import type { DonationWidgetBlock as DonationWidgetBlockProps } from '@/payload-types';
import DonationWidget from '@/components/contribute/DonationWidget';
import { HawkStarsSection } from '@/components/layout';

export const DonationWidgetBlock: React.FC<DonationWidgetBlockProps> = ({ sectionId }) => {
  return (
    <HawkStarsSection
      spacing='default'
      padding='none'
      cap='none'
      container
      id={sectionId || undefined}
      data-blockid='donationWidget'
    >
      <div className='flex justify-center'>
        <DonationWidget />
      </div>
    </HawkStarsSection>
  );
};
