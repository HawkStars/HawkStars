import React from 'react';
import HawkLinkComponent from '@/components/utils/HawkLink';
import { DropdownNavLink } from '@/payload-types';

interface DesktopDropdownV1Props {
  structure: 'single-column' | 'two-columns';
  links?: { dropdownNavLink?: DropdownNavLink | null } | null;
}

const DesktopDropdownV1: React.FC<DesktopDropdownV1Props> = ({ structure, links }) => {
  if (!links || !links.dropdownNavLink || links.dropdownNavLink.length === 0) return null;
  const linkList = links.dropdownNavLink;

  const featuredLinks = linkList.filter((link) => link.featured);
  const normalLinks = linkList.filter((link) => !link.featured);

  return (
    <div className='min-w-55 rounded-md bg-white py-2 shadow-lg ring-1 ring-black/10'>
      {/* Featured links at the top, styled simply */}
      {featuredLinks.length > 0 && (
        <ul className='mb-2 border-b border-gray-200 pb-2'>
          {featuredLinks.map((link) => (
            <li
              key={link.id}
              className='bg-bege-light hover:bg-bege-dark/60 rounded px-4 py-2 transition-colors'
            >
              <HawkLinkComponent link={link.link} className='font-semibold text-green-900'>
                {link.link.label}
              </HawkLinkComponent>
              {link.description && (
                <div className='mt-1 text-xs text-gray-500'>{link.description}</div>
              )}
            </li>
          ))}
        </ul>
      )}
      {/* Normal links below */}
      <ul>
        {normalLinks.map((link) => (
          <li key={link.id} className='rounded px-4 py-2 transition-colors hover:bg-gray-100'>
            <HawkLinkComponent link={link.link} className='text-gray-900'>
              {link.link.label}
            </HawkLinkComponent>
            {link.description && (
              <div className='mt-1 text-xs text-gray-500'>{link.description}</div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DesktopDropdownV1;
