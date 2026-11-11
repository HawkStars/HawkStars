import { cn } from '@/lib/utils';

/**
 * Shared building blocks for the crowdfunding sub-site. Neutral (no 'use client',
 * no async) so they render both in the public server page and in the Payload live
 * preview, which is a client component.
 */

export const SectionEyebrow = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <p className={cn('text-eyebrow text-crowdfunding-accent flex items-center gap-3', className)}>
    <span aria-hidden='true' className='bg-crowdfunding-accent h-px w-8 shrink-0' />
    {children}
  </p>
);

/** Orange highlight inside a heading, as in the campaign artwork. */
export const Highlight = ({ children }: { children: React.ReactNode }) => (
  <span className='text-crowdfunding-accent'>{children}</span>
);

/** Soft orange orb echoing the campaign artwork. Purely decorative. */
export const Glow = ({ className }: { className?: string }) => (
  <div
    aria-hidden='true'
    className={cn(
      'pointer-events-none absolute rounded-full bg-[radial-gradient(circle,var(--color-crowdfunding-glow)_0%,transparent_65%)] opacity-35 blur-3xl',
      className
    )}
  />
);

export const Container = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn('relative mx-auto w-full max-w-7xl px-4 lg:px-8', className)}>{children}</div>
);

/** Section shell: background, vertical rhythm and clipping for the glow orbs. */
export const CfSection = ({
  children,
  className,
  id,
  alt = false,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
  alt?: boolean;
}) => (
  <section
    id={id}
    className={cn(
      'relative w-full scroll-mt-16 overflow-hidden py-16 lg:py-24',
      alt ? 'bg-crowdfunding-surface-alt' : 'bg-crowdfunding-bg',
      className
    )}
  >
    {children}
  </section>
);

export const ProgressBar = ({
  percentage,
  markers = [],
  label,
}: {
  percentage: number;
  markers?: { at: number; label: string }[];
  label: string;
}) => (
  <div className='relative'>
    <div
      role='progressbar'
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.min(percentage, 100)}
      className='h-3 w-full overflow-hidden rounded-full bg-white/10'
    >
      <div
        className='from-crowdfunding-accent-strong to-crowdfunding-accent h-full rounded-full bg-linear-to-r transition-[width] duration-1000'
        style={{ width: `${Math.min(Math.max(percentage, 2), 100)}%` }}
      />
    </div>
    {markers.map((marker) => (
      <div
        key={marker.at}
        className='absolute top-0 flex -translate-x-1/2 flex-col items-center'
        style={{ left: `${marker.at}%` }}
      >
        <span aria-hidden='true' className='bg-crowdfunding-bg h-3 w-0.5' />
        <span className='text-crowdfunding-muted mt-1.5 text-xs whitespace-nowrap'>
          {marker.label}
        </span>
      </div>
    ))}
  </div>
);
