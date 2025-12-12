import React from 'react';

import HawkLinkComponent from '@/components/utils/HawkLink';

interface DesktopDropdownV2Props {
  column: MenuColumn['data'];
}

const DesktopDropdownV2: React.FC<DesktopDropdownV2Props> = ({ column }) => {
  if (!column.links || column.links.length === 0) return null;

  return (
    <div className='absolute top-full left-0 z-50 mt-2 grid min-w-75 grid-cols-2 gap-4 rounded-md bg-white p-4 shadow-xl ring-1 ring-black/10'>
      {column.links.map((link, idx) => (
        <div key={idx} className='rounded px-2 py-1 hover:bg-gray-100'>
          <HawkLinkComponent link={link.link} className='block font-medium text-gray-900' />
          {link.description && <div className='mt-1 text-xs text-gray-500'>{link.description}</div>}
        </div>
      ))}
    </div>
  );
};

export default DesktopDropdownV2;
