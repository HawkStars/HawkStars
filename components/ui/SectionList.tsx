import { cn } from '@/lib/utils';

export type SectionListItem = {
  label: string;
  description?: string;
};

type SectionListProps = {
  items: SectionListItem[];
  sectionId?: string;
  ordered?: boolean;
  className?: string;
  itemClassName?: string;
};

const SectionList = ({
  items,
  sectionId,
  ordered = false,
  className,
  itemClassName,
}: SectionListProps) => {
  const Tag = ordered ? 'ol' : 'ul';

  return (
    <Tag id={sectionId} className={cn('flex flex-col gap-2', className)}>
      {items.map((item, index) => (
        <li
          key={index}
          className={cn(
            'border-bege-dark/30 flex flex-col gap-0.5 border-l-2 py-1 pl-4',
            'hover:border-bege-dark/60 transition-colors',
            itemClassName
          )}
        >
          <span className='text-md font-bold text-black'>
            {ordered && <span className='mr-1.5 text-gray-700/60'>{index + 1}.</span>}
            {item.label}
          </span>
          {item.description && (
            <span className='text-md leading-relaxed text-gray-400'>{item.description}</span>
          )}
        </li>
      ))}
    </Tag>
  );
};

export default SectionList;
