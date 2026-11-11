import type { ReactNode } from 'react';
import type { IconType } from 'react-icons';
import { LuCalendarClock } from 'react-icons/lu';

type ListingEmptyProps = {
  title: string;
  description?: string;
  icon?: IconType;
  /** A follow-up action, e.g. a link to the archive. */
  action?: ReactNode;
};

/** Empty state shared by the news, projects and events listings. */
const ListingEmpty = ({
  title,
  description,
  icon: Icon = LuCalendarClock,
  action,
}: ListingEmptyProps) => (
  <div className='bg-bege-light border-bege-dark flex flex-col gap-5 rounded-xl border px-6 py-8 sm:flex-row sm:items-center lg:px-8'>
    <span className='bg-bege-dark flex size-14 shrink-0 items-center justify-center rounded-full'>
      <Icon aria-hidden='true' className='text-green size-7' />
    </span>
    <div className='flex flex-1 flex-col gap-1'>
      <p className='text-body_semibold'>{title}</p>
      {description && <p className='text-body_regular text-black/70'>{description}</p>}
    </div>
    {action && <div className='self-start sm:self-center'>{action}</div>}
  </div>
);

export default ListingEmpty;
