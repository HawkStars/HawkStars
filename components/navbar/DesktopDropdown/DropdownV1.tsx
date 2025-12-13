import React from 'react';
import HawkLinkComponent from '@/components/utils/HawkLink';
import { DropdownNavLink } from '@/payload-types';

type DesktopDropdownV1Props = {
  structure: 'single-column' | 'two-columns';
  links?: { dropdownNavLink?: DropdownNavLink | null } | null;
};

const DesktopDropdownV1: React.FC<DesktopDropdownV1Props> = ({ structure, links }) => {
  if (!links || !links.dropdownNavLink || links.dropdownNavLink.length === 0) return null;
  const linkList = links.dropdownNavLink;
  const linksToShow =
    structure === 'single-column' ? linkList.slice(0, Math.ceil(linkList.length / 2)) : linkList;

  return (
    <ul className='py-2'>
      {linkList.map((link, idx) => {
        if (!link) return null;
        const linkData = link.link;

        return (
          <li key={idx} className='px-4 py-2 hover:bg-gray-100'>
            <HawkLinkComponent link={linkData} className='block text-gray-900' />
          </li>
        );
      })}
    </ul>
  );
};

export default DesktopDropdownV1;
