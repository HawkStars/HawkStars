import type { DataGridBlock as DataGridBlockProps } from '@/payload-types';

// todo: change this to be more applealing.
// add possibility of multiple columns

export const DataGridBlock: React.FC<DataGridBlockProps> = ({
  title,
  columnOneHeader,
  columnTwoHeader,
  rows,
  sectionId,
}) => {
  return (
    <section className='py-16 md:py-24' id={sectionId || undefined}>
      <div className='container mx-auto px-4'>
        {title && <h2 className='text-h2_bold mb-8 text-center tracking-tight'>{title}</h2>}
        <div className='overflow-hidden rounded-lg'>
          <table className='mx-auto min-w-6xl'>
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
      </div>
    </section>
  );
};
