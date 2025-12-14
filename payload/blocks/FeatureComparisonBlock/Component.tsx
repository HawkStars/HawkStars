import React from 'react';
import { Check, X } from 'lucide-react';
import type { FeatureComparisonBlock as FeatureComparisonBlockProps } from '@/payload-types';
import { cn } from '@/lib/utils';

export const FeatureComparisonBlock: React.FC<FeatureComparisonBlockProps> = ({
  title,
  columns = [],
  features = [],
}) => {
  if (!columns || columns.length === 0 || !features || features.length === 0) {
    return null;
  }

  return (
    <section className='py-12 lg:py-20'>
      <div className='container mx-auto'>
        {title && <h2 className='mb-12 text-center text-3xl font-bold lg:text-4xl'>{title}</h2>}
        
        <div className='overflow-x-auto'>
          <table className='w-full border-collapse'>
            <thead>
              <tr>
                <th className='border-b border-gray-200 p-4 text-left'></th>
                {columns.map((column, index) => (
                  <th
                    key={index}
                    className={cn(
                      'border-b border-gray-200 p-4 text-center',
                      column.highlighted && 'bg-green-50'
                    )}
                  >
                    <div className='text-xl font-bold'>{column.name}</div>
                    {column.highlighted && (
                      <div className='mt-1 text-xs font-semibold uppercase text-green-600'>
                        Recommended
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {features.map((feature, featureIndex) => (
                <tr key={featureIndex} className='border-b border-gray-100'>
                  <td className='p-4 font-medium'>{feature.feature}</td>
                  {columns.map((column, columnIndex) => {
                    const hasFeature = feature[`column${columnIndex + 1}` as 'column1' | 'column2' | 'column3'];
                    
                    return (
                      <td
                        key={columnIndex}
                        className={cn(
                          'p-4 text-center',
                          column.highlighted && 'bg-green-50/50'
                        )}
                      >
                        {hasFeature ? (
                          <Check className='mx-auto h-6 w-6 text-green-600' />
                        ) : (
                          <X className='mx-auto h-6 w-6 text-gray-300' />
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
