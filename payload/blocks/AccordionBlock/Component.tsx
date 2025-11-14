'use client';

import React, { useState } from 'react';
import RichText from '@/payload/components/RichText';
import classNames from 'classnames';
import { ChevronDownIcon } from 'lucide-react';

// Temporary types until we regenerate payload-types
interface AccordionItem {
  title: string;
  content: any;
  defaultOpen?: boolean;
}

interface AccordionBlockProps {
  items?: AccordionItem[];
  allowMultipleOpen?: boolean;
  style?: 'default' | 'bordered' | 'card';
}

export const AccordionBlock: React.FC<AccordionBlockProps> = ({
  items,
  allowMultipleOpen = false,
  style = 'default',
}) => {
  const [openItems, setOpenItems] = useState<Set<number>>(
    new Set(
      items
        ?.map((item: AccordionItem, index: number) => (item.defaultOpen ? index : -1))
        .filter((i: number) => i >= 0) || []
    )
  );

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);

    if (allowMultipleOpen) {
      if (newOpenItems.has(index)) {
        newOpenItems.delete(index);
      } else {
        newOpenItems.add(index);
      }
    } else {
      newOpenItems.clear();
      if (!openItems.has(index)) {
        newOpenItems.add(index);
      }
    }

    setOpenItems(newOpenItems);
  };

  const containerClasses = {
    default: 'space-y-2',
    bordered: 'space-y-2 border border-gray-200 rounded-lg overflow-hidden',
    card: 'space-y-4',
  };

  const itemClasses = {
    default: 'border-b border-gray-200',
    bordered: 'border-b border-gray-200 last:border-b-0',
    card: 'bg-white rounded-lg shadow-sm border border-gray-200',
  };

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className='py-8'>
      <div className='mx-auto max-w-4xl px-4'>
        <div className={containerClasses[style as keyof typeof containerClasses]}>
          {items.map((item: AccordionItem, index: number) => {
            const isOpen = openItems.has(index);

            return (
              <div key={index} className={itemClasses[style as keyof typeof itemClasses]}>
                <button
                  className={classNames(
                    'flex w-full items-center justify-between px-4 py-4 text-left',
                    'transition-colors duration-200 hover:bg-gray-50',
                    style === 'card' && 'rounded-t-lg',
                    isOpen && style !== 'card' && 'bg-gray-50'
                  )}
                  onClick={() => toggleItem(index)}
                  aria-expanded={isOpen}
                >
                  <span className='pr-4 text-lg font-semibold'>{item.title}</span>
                  <ChevronDownIcon
                    className={classNames(
                      'h-5 w-5 flex-shrink-0 transition-transform duration-200',
                      isOpen && 'rotate-180 transform'
                    )}
                  />
                </button>

                {isOpen && (
                  <div
                    className={classNames(
                      'animate-in slide-in-from-top-2 px-4 pb-4 duration-200',
                      style === 'card' && 'border-t border-gray-200'
                    )}
                  >
                    <div className='pt-2'>
                      <RichText data={item.content} />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
