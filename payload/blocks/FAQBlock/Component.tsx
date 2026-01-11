'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { FAQBlock as FAQBlockProps } from '@/payload-types';
import { cn } from '@/lib/utils';

export const FAQBlock: React.FC<FAQBlockProps> = ({ title, items = [], sectionId }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <section className='py-12 lg:py-20' id={sectionId || ''}>
      <div className='container mx-auto'>
        {title && <h2 className='mb-12 text-center text-3xl font-bold lg:text-4xl'>{title}</h2>}

        <div className='mx-auto max-w-3xl space-y-4'>
          {items.map((item, index) => (
            <div key={index} className='overflow-hidden rounded-lg border border-gray-200 bg-white'>
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className='flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-gray-50'
              >
                <span className='pr-8 text-lg font-semibold'>{item.question}</span>
                <ChevronDown
                  className={cn(
                    'h-5 w-5 shrink-0 transition-transform',
                    openIndex === index && 'rotate-180'
                  )}
                />
              </button>
              <div
                className={cn(
                  'grid transition-all duration-300',
                  openIndex === index ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                )}
              >
                <div className='overflow-hidden'>
                  <p className='px-6 pb-6 text-gray-700'>{item.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
