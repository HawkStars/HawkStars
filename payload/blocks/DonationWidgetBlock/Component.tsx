'use client';

import React from 'react';
import type { DonationWidgetBlock as DonationWidgetBlockProps } from '@/payload-types';
import DonationWidget from '@/components/contribute/DonationWidget';

export const DonationWidgetBlock: React.FC<DonationWidgetBlockProps> = ({ sectionId }) => {
  return (
    <section className='section' id={sectionId || ''} data-blockId='donationWidget'>
      <div className='section-container flex justify-center'>
        <DonationWidget />
      </div>
    </section>
  );
};
