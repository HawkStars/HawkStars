import type { DataGridBlock as DataGridBlockProps } from '@/payload-types';
import { HawkStarsSection } from '@/components/layout';
import { cn } from '@/lib/utils';

const headerCell = 'text-body_semibold px-4 py-3 text-left align-bottom lg:px-6 lg:py-4';
const bodyCell = 'text-body_regular px-4 py-3 text-left align-top lg:px-6 lg:py-4';

export const DataGridBlock: React.FC<DataGridBlockProps> = ({
  title,
  columnOneHeader,
  columnTwoHeader,
  columnThreeHeader,
  rows,
  sectionId,
}) => {
  const hasThirdColumn = Boolean(columnThreeHeader);

  return (
    <HawkStarsSection
      spacing='default'
      padding='none'
      cap='none'
      container
      id={sectionId || undefined}
      data-blockid='dataGridBlock'
    >
      {title && (
        <h2 data-reveal='up' className='text-h2_semibold section-header text-center'>
          {title}
        </h2>
      )}
      {/* A white card with warm row rules. The table fills the content column (the old
          `lg:min-w-6xl` overflowed it between 1024 and 1280px) and wraps text on mobile
          instead of forcing a sideways scroll; `overflow-x-auto` stays as a safety net. */}
      <div className='card border-bege-dark overflow-x-auto border'>
        <table className='w-full border-collapse'>
          <thead>
            <tr className='bg-bege-dark'>
              <th scope='col' className={headerCell}>
                {columnOneHeader}
              </th>
              <th scope='col' className={headerCell}>
                {columnTwoHeader}
              </th>
              {hasThirdColumn && (
                <th scope='col' className={headerCell}>
                  {columnThreeHeader}
                </th>
              )}
            </tr>
          </thead>
          <tbody data-reveal-stagger='up'>
            {rows?.map((row, index) => (
              <tr
                key={row.id || index}
                className='border-bege-dark even:bg-bege-light border-t first:border-t-0'
              >
                <th scope='row' className={cn(bodyCell, 'font-semibold')}>
                  {row.columnOne}
                </th>
                <td className={bodyCell}>{row.columnTwo}</td>
                {hasThirdColumn && <td className={bodyCell}>{row.columnThree}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </HawkStarsSection>
  );
};
