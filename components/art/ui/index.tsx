import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  as?: 'h1' | 'h2';
  align?: 'left' | 'center';
  actions?: ReactNode;
  className?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  as: Heading = 'h2',
  align = 'left',
  actions,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        'border-art-line flex flex-col gap-6 border-b pb-6 md:flex-row md:items-end md:justify-between',
        align === 'center' && 'items-center text-center md:flex-col md:items-center',
        className
      )}
    >
      <div className='flex flex-col gap-3'>
        {eyebrow && <p className='art-eyebrow'>{eyebrow}</p>}
        <Heading className='art-heading'>{title}</Heading>
      </div>
      {actions && <div className='flex flex-wrap items-center gap-3'>{actions}</div>}
    </div>
  );
}

/** Small uppercase tag laid over artwork images ("Peça Única", "Tiragem: 2 de 5"…). */
export function Placard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'bg-art-ebony/85 border-art-line font-art-sans text-art-cream border px-2.5 py-1 text-[11px] tracking-wider backdrop-blur-sm',
        className
      )}
    >
      {children}
    </span>
  );
}

/** Page hero used by the listing pages (catalogue, artists, news). */
export function PageHero({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <section className='art-spotlight border-art-line border-b px-4 pt-20 pb-16 text-center md:pt-28 md:pb-20'>
      <h1 className='art-display'>{title}</h1>
      <span aria-hidden className='bg-art-gold/50 mx-auto my-6 block h-px w-16' />
      {subtitle && (
        // One line from tablet up; wraps normally on small phones.
        <p className='font-art-sans text-art-text-2 mx-auto text-base md:text-lg md:whitespace-nowrap'>
          {subtitle}
        </p>
      )}
    </section>
  );
}
