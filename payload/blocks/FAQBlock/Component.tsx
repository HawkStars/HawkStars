'use client';

import React, { useId, useState } from 'react';
import { LuChevronDown } from 'react-icons/lu';
import type { FAQBlock as FAQBlockProps } from '@/payload-types';
import { cn } from '@/lib/utils';
import { HawkStarsSection } from '@/components/layout';

export const FAQBlock: React.FC<FAQBlockProps> = ({ title, items = [], sectionId }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const panelIdPrefix = useId();

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <HawkStarsSection
      spacing='default'
      padding='none'
      cap='none'
      container
      id={sectionId || undefined}
      data-blockid='faq'
    >
      {title && (
        <h2 data-reveal='up' className='text-h2_semibold section-header text-center'>
          {title}
        </h2>
      )}

      <div data-reveal-stagger='up' className='mx-auto max-w-3xl space-y-4'>
        {items.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={item.id || index}
              className={cn(
                'overflow-hidden rounded-xl border bg-white transition-[border-color,box-shadow] duration-200',
                isOpen ? 'border-green shadow-md' : 'border-bege-dark shadow-sm'
              )}
            >
              {/* Heading wrapper so screen-reader users can jump between questions. */}
              <h3>
                <button
                  type='button'
                  aria-expanded={isOpen}
                  aria-controls={`${panelIdPrefix}-${index}`}
                  id={`${panelIdPrefix}-${index}-trigger`}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className={cn(
                    'flex min-h-11 w-full items-center justify-between gap-4 p-5 text-left transition-colors lg:p-6',
                    isOpen ? 'hover:bg-green/5' : 'hover:bg-bege-light'
                  )}
                >
                  <span
                    className={cn(
                      'text-h3_semibold transition-colors',
                      isOpen ? 'text-green' : 'text-black'
                    )}
                  >
                    {item.question}
                  </span>
                  <span
                    aria-hidden='true'
                    className={cn(
                      'flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300',
                      isOpen ? 'bg-green text-white' : 'bg-bege-dark text-green'
                    )}
                  >
                    <LuChevronDown
                      className={cn(
                        'h-4 w-4 transition-transform duration-300',
                        isOpen && 'rotate-180'
                      )}
                    />
                  </span>
                </button>
              </h3>
              {/* `grid-rows-[0fr]` + overflow-hidden collapses visually but leaves the
                  answer in the accessibility tree, so every answer was read aloud
                  regardless of state. `inert` takes it out without losing the
                  transition. */}
              <div
                id={`${panelIdPrefix}-${index}`}
                role='region'
                aria-labelledby={`${panelIdPrefix}-${index}-trigger`}
                inert={!isOpen}
                className={cn(
                  'grid transition-all duration-300',
                  isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                )}
              >
                <div className='overflow-hidden'>
                  <p className='border-bege-dark text-body_regular border-t px-5 py-5 leading-relaxed whitespace-pre-line text-black/80 lg:px-6'>
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </HawkStarsSection>
  );
};
