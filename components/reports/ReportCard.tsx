import Link from 'next/link';
import { LuArrowRight } from 'react-icons/lu';
import type { ImpactReport } from '@/payload-types';
import { cn } from '@/lib/utils';

type ReportCardProps = {
  report: Pick<ImpactReport, 'year' | 'title' | 'summary' | 'stats'>;
  href: string;
  readLabel: string;
  featured?: boolean;
};

/** A year's report in the /impact list: big year, title, first stats, link. */
export const ReportCard = ({ report, href, readLabel, featured }: ReportCardProps) => {
  const stats = (report.stats ?? []).slice(0, featured ? 4 : 2);

  return (
    <Link
      href={href}
      className={cn(
        'group flex h-full flex-col overflow-hidden rounded-xl border transition-[translate,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lg',
        featured ? 'bg-green border-green text-white' : 'border-bege-dark bg-white'
      )}
    >
      <div className={cn('flex flex-1 flex-col gap-4', featured ? 'p-8 lg:p-12' : 'p-6 lg:p-8')}>
        <p
          className={cn(
            'font-display leading-none font-semibold',
            featured ? 'text-bege-dark text-7xl lg:text-8xl' : 'text-green text-6xl'
          )}
        >
          {report.year}
        </p>
        <h3 className={featured ? 'text-h2_semibold' : 'text-h2_bold'}>{report.title}</h3>
        {report.summary && (
          <p
            className={cn(
              'leading-relaxed',
              featured ? 'text-lg text-white/90' : 'line-clamp-3 text-black/70'
            )}
          >
            {report.summary}
          </p>
        )}
        {stats.length > 0 && (
          <dl
            className={cn(
              'mt-2 grid gap-3',
              featured ? 'grid-cols-2 lg:grid-cols-4' : 'grid-cols-2'
            )}
          >
            {stats.map((stat, index) => (
              <div
                key={stat.id || index}
                className={cn(
                  'flex flex-col rounded-lg p-3',
                  featured ? 'bg-white/10' : 'bg-bege-light'
                )}
              >
                <dt className={cn('text-xs', featured ? 'text-white/80' : 'text-black/60')}>
                  {stat.label}
                </dt>
                <dd
                  className={cn('text-h2_bold order-first', featured ? 'text-white' : 'text-green')}
                >
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        )}
        <span
          className={cn(
            'mt-auto flex items-center gap-2 pt-4 font-semibold',
            featured ? 'text-white' : 'text-green'
          )}
        >
          {readLabel}
          <LuArrowRight
            aria-hidden='true'
            className='size-4 transition-transform group-hover:translate-x-1'
          />
        </span>
      </div>
    </Link>
  );
};
