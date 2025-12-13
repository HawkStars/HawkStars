import React from 'react';

import HawkLinkComponent from '@/components/utils/HawkLink';
import { DropdownNavLink } from '@/payload-types';

interface DesktopDropdownV2Props {
  structure: 'single-column' | 'two-columns';
  links?: { dropdownNavLink?: DropdownNavLink | null } | null;
}

const DesktopDropdownV2: React.FC<DesktopDropdownV2Props> = ({ structure, links }) => {
  if (!links || !links.dropdownNavLink || links.dropdownNavLink.length === 0) return null;
  const linkList = links.dropdownNavLink;
  const linksToShow =
    structure === 'single-column' ? linkList.slice(0, Math.ceil(linkList.length / 2)) : linkList;

  return (
    <>
      {linkList.map((link, idx) => {
        if (!link) return null;
        const linkData = link.link;

        return (
          <li key={idx} className='px-4 py-2 hover:bg-gray-100'>
            <HawkLinkComponent link={link.link} className='block font-medium text-gray-900' />
            {link.description && (
              <div className='mt-1 text-xs text-gray-500'>{link.description}</div>
            )}
          </li>
        );
      })}
    </>
  );
};

export default DesktopDropdownV2;
