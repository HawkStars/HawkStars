import React from 'react';
import type { ColumnBasedBlock as ColumnBasedProps } from '@/payload-types';

import * as LucideIcons from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * ColumnBasedBlock Component
 *
 * Renders a responsive grid of columns (1-6) with optional icons, titles, subtitles, and lists.
 *
 * @example
 * // In Payload CMS:
 * {
 *   columns: [
 *     {
 *       icon: "User",           // Optional: Lucide icon name
 *       title: "About Us",      // Required: Column title
 *       subtitle: "Who we are", // Optional: Column subtitle
 *       list: [                 // Optional: List of items
 *         { item: "Founded in 2020" },
 *         { item: "Global presence" }
 *       ]
 *     }
 *   ]
 * }
 */
export const ColumnBasedBlock: React.FC<ColumnBasedProps> = ({ columns }) => {
  if (!columns || columns.length === 0) return null;

  // Determine grid columns based on number of columns
  const getGridClasses = () => {
    const count = columns.length;
    switch (count) {
      case 1:
        return 'md:grid-cols-1';
      case 2:
        return 'md:grid-cols-2';
      case 3:
        return 'md:grid-cols-2 lg:grid-cols-3';
      case 4:
        return 'md:grid-cols-2 lg:grid-cols-4';
      case 5:
        return 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5';
      case 6:
        return 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6';
      default:
        return 'md:grid-cols-2 lg:grid-cols-3';
    }
  };

  return (
    <div className='container'>
      <div className={cn('grid gap-6 md:gap-8', getGridClasses())}>
        {columns.map((column, index) => {
          // Dynamically get the icon component
          const IconComponent = column.icon
            ? ((LucideIcons as unknown as Record<string, React.ComponentType>)[
                column.icon
              ] as LucideIcons.LucideIcon)
            : null;

          return (
            <div key={index} className='border-border flex flex-col gap-4 rounded-lg border p-6'>
              {/* Icon */}
              {IconComponent && (
                <div className='bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg'>
                  <IconComponent className='text-primary h-6 w-6' />
                </div>
              )}

              {/* Title */}
              {column.title && <h3 className='text-xl font-semibold'>{column.title}</h3>}

              {/* Subtitle */}
              {column.subtitle && (
                <p className='text-muted-foreground text-sm'>{column.subtitle}</p>
              )}

              {/* List */}
              {column.list && column.list.length > 0 && (
                <ul className='mt-2 space-y-2'>
                  {column.list.map((listItem, listIndex) => (
                    <li key={listIndex} className='flex items-start gap-2'>
                      <span className='bg-primary mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full' />
                      <span className='text-sm'>{listItem.item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
