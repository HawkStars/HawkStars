import React from 'react';
import HawkLinkComponent from '@/components/utils/HawkLink';

interface DesktopDropdownV1Props {
  column: MenuColumn['data'];
}

const DesktopDropdownV1: React.FC<DesktopDropdownV1Props> = ({ column }) => {
  if (!column.links || column.links.length === 0) return null;

  return (
    <div className='absolute top-full left-0 z-50 mt-2 w-56 rounded-md bg-white shadow-lg ring-1 ring-black/5'>
      <ul className='py-2'>
        {column.links.map((link, idx) => (
          <li key={idx} className='px-4 py-2 hover:bg-gray-100'>
            <HawkLinkComponent link={link.link} className='block text-gray-900' />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DesktopDropdownV1;
