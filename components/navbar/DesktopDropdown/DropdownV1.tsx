import React from 'react';
import HawkLinkComponent from '@/components/utils/HawkLink';
import { DropdownNavLink } from '@/payload-types';
import { DropdownLinkField, getDropdownImageElement } from './utils';
import { cn } from '@/lib/utils';

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
    <div className='mx-auto flex max-w-5xl gap-6 p-4'>
      {/* Featured links - Card style with gradient hover */}
      {featuredLinks.length > 0 && (
        <div className='flex flex-col gap-3'>
          {featuredLinks.map((link) => (
            <FeaturedLinkCard key={link.id} link={link} />
          ))}
        </div>
      )}

      {/* Normal links - Clean list with icons */}
      <div
        className={cn('flex flex-col gap-1', {
          'grid grid-cols-2 gap-x-8 gap-y-1': structure === 'two-columns' && normalLinks.length > 4,
        })}
      >
        {normalLinks.map((link) => (
          <NormalLinkItem key={link.id} link={link} />
        ))}
      </div>
    </div>
  );
};

type LinkProps = {
  link: DropdownLinkField;
};

const FeaturedLinkCard: React.FC<LinkProps> = ({ link }) => {
  const imageType = link.imageIcon?.type;
  const ImageElement = getDropdownImageElement(link, 'rounded-lg object-cover', {
    height: 120,
    width: 224,
  });

  return (
    <HawkLinkComponent
      link={link.link}
      className={cn(
        'group relative flex min-h-30 w-56 flex-col justify-end overflow-hidden rounded-xl p-4 shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-xl',
        { 'bg-linear-to-br from-green-800 to-green-950': imageType !== 'image' }
      )}
    >
      {/* Background image or gradient overlay */}
      {ImageElement && imageType === 'image' && (
        <div className='absolute inset-0 duration-300'>{ImageElement}</div>
      )}

      {/* Icon overlay */}
      {ImageElement && imageType === 'icon' && (
        <div className='absolute top-3 right-3 text-white/60 transition-transform duration-300 group-hover:scale-110 group-hover:text-white/90'>
          {ImageElement}
        </div>
      )}

      {/* Content */}
      <div className='relative z-10'>
        <h4 className='text-lg font-semibold text-white'>{link.link.label}</h4>
        {link.description && (
          <p className='mt-1 line-clamp-2 text-sm text-white/80'>{link.description}</p>
        )}
      </div>

      {/* Hover shine effect */}
      <div className='absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/10 to-transparent transition-transform duration-500 group-hover:translate-x-full' />
    </HawkLinkComponent>
  );
};

const NormalLinkItem: React.FC<LinkProps> = ({ link }) => {
  const imageType = link.imageIcon?.type;
  const ImageElement = getDropdownImageElement(link, 'rounded');

  return (
    <HawkLinkComponent
      link={link.link}
      className='group hover:bg-bege-light flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200'
    >
      {/* Icon */}
      {ImageElement && imageType === 'icon' && (
        <div className='flex h-8 w-8 items-center justify-center rounded-md bg-green-100 p-1 text-green-700 transition-colors duration-200 group-hover:bg-green-700 group-hover:text-white'>
          {ImageElement}
        </div>
      )}

      {/* Arrow indicator when no icon */}
      {!ImageElement && (
        <div className='flex h-8 w-8 items-center justify-center rounded-md bg-gray-100 text-gray-400 transition-all duration-200 group-hover:bg-green-700 group-hover:text-white'>
          <svg
            className='h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
            strokeWidth={2}
          >
            <path strokeLinecap='round' strokeLinejoin='round' d='M9 5l7 7-7 7' />
          </svg>
        </div>
      )}

      {/* Text content */}
      <div className='flex flex-col'>
        <span className='text-sm font-medium text-gray-900 transition-colors group-hover:text-green-800'>
          {link.link.label}
        </span>
        {link.description && (
          <span className='line-clamp-1 text-xs text-gray-500'>{link.description}</span>
        )}
      </div>
    </HawkLinkComponent>
  );
};

export default DesktopDropdownV1;
