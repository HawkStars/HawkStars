import React from 'react';
import type { ColumnBasedBlock as ColumnBasedProps } from '@/payload-types';
import { cn } from '@/payload/utilities/ui';
import * as LucideIcons from 'lucide-react';

export const ColumnBasedBlock: React.FC<ColumnBasedProps> = ({ columns }) => {
  if (!columns || columns.length === 0) return null;

  // Determine grid columns based on number of columns
  const getGridClasses = () => {
    const count = columns.length;
    switch (count) {
      case 1:
        return 'lg:grid-cols-1';
      case 2:
        return 'lg:grid-cols-2';
      case 3:
        return 'lg:grid-cols-3';
      case 4:
        return 'lg:grid-cols-4';
      case 5:
        return 'lg:grid-cols-5';
      case 6:
        return 'lg:grid-cols-6';
      default:
        return 'lg:grid-cols-3';
    }
  };

  return (
    <div className='container'>
      <div className={cn('grid gap-6 md:gap-8', getGridClasses())}>
        {columns.map((column, index) => {
          // Dynamically get the icon component
          const IconComponent = column.icon
            ? (LucideIcons as any)[column.icon]
            : null;

          return (
            <div
              key={index}
              className='flex flex-col gap-4 rounded-lg border border-border p-6'
            >
              {/* Icon */}
              {IconComponent && (
                <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10'>
                  <IconComponent className='h-6 w-6 text-primary' />
                </div>
              )}

              {/* Title */}
              {column.title && (
                <h3 className='text-xl font-semibold'>{column.title}</h3>
              )}

              {/* Subtitle */}
              {column.subtitle && (
                <p className='text-sm text-muted-foreground'>{column.subtitle}</p>
              )}

              {/* List */}
              {column.list && column.list.length > 0 && (
                <ul className='mt-2 space-y-2'>
                  {column.list.map((listItem, listIndex) => (
                    <li key={listIndex} className='flex items-start gap-2'>
                      <span className='mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary' />
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
