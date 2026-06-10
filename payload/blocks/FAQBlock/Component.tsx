'use client';

import React, { useState } from 'react';
import { LuChevronDown } from 'react-icons/lu';
import type { FAQBlock as FAQBlockProps } from '@/payload-types';
import { cn } from '@/lib/utils';

export const FAQBlock: React.FC<FAQBlockProps> = ({ title, items = [], sectionId }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <section className='section' id={sectionId || undefined} data-blockId='faq'>
      <div className='section-container'>
        {title && (
          <h2 className='mb-12 text-center text-3xl font-bold tracking-tight text-balance lg:text-4xl'>
            {title}
          </h2>
        )}

        <div className='mx-auto max-w-3xl space-y-4'>
          {items.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={cn(
                  'overflow-hidden rounded-xl border transition-colors duration-200',
                  isOpen ? 'border-green bg-white shadow-sm' : 'border-gray-200 bg-white'
                )}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className={cn(
                    'flex w-full items-center justify-between p-6 text-left transition-colors',
                    isOpen ? 'hover:bg-green/5' : 'hover:bg-gray-50'
                  )}
                >
                  <span
                    className={cn(
                      'pr-8 text-lg font-semibold transition-colors',
                      isOpen ? 'text-green' : 'text-gray-900'
                    )}
                  >
                    {item.question}
                  </span>
                  <div
                    className={cn(
                      'flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all duration-300',
                      isOpen ? 'bg-green text-white' : 'bg-gray-100 text-gray-500'
                    )}
                  >
                    <LuChevronDown
                      className={cn(
                        'h-4 w-4 transition-transform duration-300',
                        isOpen && 'rotate-180'
                      )}
                    />
                  </div>
                </button>
                <div
                  className={cn(
                    'grid transition-all duration-300',
                    isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                  )}
                >
                  <div className='overflow-hidden'>
                    <p className='border-t border-gray-100 px-6 py-5 leading-relaxed text-gray-700'>
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
