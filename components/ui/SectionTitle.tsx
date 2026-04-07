import { cn } from '@/lib/utils';

type SectionTitleProps = {
  title: string;
  sectionId: string;
  subtitle?: string;
  className?: string;
};

const SectionTitle = ({ title, sectionId, subtitle, className }: SectionTitleProps) => {
  return (
    <div id={sectionId} className={cn('border-bege-dark border-b pb-4', className)}>
      <h2 className='font-oswald text-2xl font-bold tracking-tight text-black lg:text-3xl'>
        {title}
      </h2>
      {subtitle && <p className='mt-1.5 text-sm text-black/70'>{subtitle}</p>}
    </div>
  );
};

export default SectionTitle;
