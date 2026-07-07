import { cn } from '@/lib/utils';

const ProjectSection: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return (
    <section className={cn(`py-4 lg:py-8`, className)}>
      <div className='container mx-auto max-w-6xl max-lg:px-4'>{children}</div>
    </section>
  );
};

export { ProjectSection };
