'use client';

import React from 'react';
import type { DonationWidgetBlock as DonationWidgetBlockProps } from '@/payload-types';
import DonationWidget from '@/components/contribute/DonationWidget';

export const DonationWidgetBlock: React.FC<DonationWidgetBlockProps> = ({ sectionId }) => {
  return (
    <section className='py-16 lg:py-24' id={sectionId || ''}>
      <div className='container mx-auto flex justify-center px-4'>
        <DonationWidget />
      </div>
    </section>
  );
};
