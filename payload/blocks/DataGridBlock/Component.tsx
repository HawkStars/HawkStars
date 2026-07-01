import type { DataGridBlock as DataGridBlockProps } from '@/payload-types';
import { HawkStarsSection } from '@/components/layout';

export const DataGridBlock: React.FC<DataGridBlockProps> = ({
  title,
  columnOneHeader,
  columnTwoHeader,
  rows,
  sectionId,
}) => {
  return (
    <HawkStarsSection
      spacing='default'
      padding='none'
      container
      id={sectionId || undefined}
      data-blockId='dataGridBlock'
    >
      {title && (
        <h2 className='text-h2_bold mb-10 text-center tracking-tight text-balance md:mb-12'>
          {title}
        </h2>
      )}
      <div className='overflow-x-auto rounded-lg'>
        <table className='lg:mx-auto lg:min-w-6xl'>
          <thead>
            <tr className='bg-bege-dark border-bege-light border-b'>
              <th className='px-6 py-4 text-center text-sm font-semibold'>{columnOneHeader}</th>
              <th className='px-6 py-4 text-center text-sm font-semibold'>{columnTwoHeader}</th>
            </tr>
          </thead>
          <tbody className='text-body'>
            {rows?.map((row, index) => (
              <tr key={index}>
                <td className='border-r-bege-dark border-r px-6 py-4 text-center text-sm'>
                  {row.columnOne}
                </td>
                <td className='px-6 py-4 text-center text-sm'>{row.columnTwo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </HawkStarsSection>
  );
};
