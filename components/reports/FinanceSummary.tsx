import type { ImpactReportMoneyLine } from '@/payload-types';
import { Language } from '@/i18n/settings';
import { cn } from '@/lib/utils';

type FinanceSummaryProps = {
  income?: number | null;
  expenses?: number | null;
  closingBalance?: number | null;
  incomeLines?: ImpactReportMoneyLine | null;
  expenseLines?: ImpactReportMoneyLine | null;
  labels: { income: string; expenses: string; balance: string };
  lng: Language;
};

const euro = (lng: Language) =>
  new Intl.NumberFormat(lng === 'pt' ? 'pt-PT' : 'en-GB', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  });

/** One column (income or expenses): total, then each line as a proportional bar. */
const Column = ({
  title,
  total,
  lines,
  barClass,
  format,
}: {
  title: string;
  total?: number | null;
  lines?: ImpactReportMoneyLine | null;
  barClass: string;
  format: Intl.NumberFormat;
}) => {
  const sum = total || lines?.reduce((acc, line) => acc + line.amount, 0) || 0;

  return (
    <div className='card flex flex-col gap-5 bg-white p-6 lg:p-8'>
      <div>
        <p className='text-eyebrow text-black/60'>{title}</p>
        <p className='text-h1_semibold text-green'>{format.format(sum)}</p>
      </div>
      {lines && lines.length > 0 && (
        <ul className='flex flex-col gap-4'>
          {lines.map((line, index) => {
            const share = sum ? Math.max(2, Math.round((line.amount / sum) * 100)) : 0;
            return (
              <li key={line.id || index}>
                <div className='mb-1.5 flex items-baseline justify-between gap-4 text-sm'>
                  <span className='text-black/80'>{line.label}</span>
                  <span className='font-semibold tabular-nums'>{format.format(line.amount)}</span>
                </div>
                <div className='bg-bege-light h-2 overflow-hidden rounded-full'>
                  <div
                    className={cn('h-full rounded-full', barClass)}
                    style={{ width: `${share}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

/** Income vs expenses for a report year, with the balance carried forward below. */
export const FinanceSummary = ({
  income,
  expenses,
  closingBalance,
  incomeLines,
  expenseLines,
  labels,
  lng,
}: FinanceSummaryProps) => {
  const format = euro(lng);
  const hasData = Boolean(income || expenses || incomeLines?.length || expenseLines?.length);
  if (!hasData) return null;

  return (
    <div className='flex flex-col gap-6'>
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
        <Column
          title={labels.income}
          total={income}
          lines={incomeLines}
          barClass='bg-green'
          format={format}
        />
        <Column
          title={labels.expenses}
          total={expenses}
          lines={expenseLines}
          barClass='bg-green/45'
          format={format}
        />
      </div>
      {closingBalance != null && (
        <div className='bg-green flex flex-col items-start justify-between gap-2 rounded-xl p-6 text-white sm:flex-row sm:items-center lg:px-8'>
          <p className='text-body_semibold'>{labels.balance}</p>
          <p className='text-h2_semibold'>{format.format(closingBalance)}</p>
        </div>
      )}
    </div>
  );
};
