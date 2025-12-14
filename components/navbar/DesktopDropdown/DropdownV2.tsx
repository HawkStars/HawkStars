import React from 'react';

import HawkLinkComponent from '@/components/utils/HawkLink';
import { DropdownNavLink } from '@/payload-types';
import { DropdownLinkField, getDropdownImageElement } from './utils';
import { cn } from '@/lib/utils';

interface DesktopDropdownV2Props {
  structure: 'single-column' | 'two-columns';
  links?: { dropdownNavLink?: DropdownNavLink | null } | null;
}

const DesktopDropdownV2: React.FC<DesktopDropdownV2Props> = ({ structure, links }) => {
  if (!links || !links.dropdownNavLink || links.dropdownNavLink.length === 0) return null;
  const linkList = links.dropdownNavLink;

  const featuredLinks = linkList.filter((link) => link.featured);
  const normalLinks = linkList.filter((link) => !link.featured);

  return (
    <div className='mx-auto flex max-w-6xl gap-3'>
      {featuredLinks.map((link) => {
        return <FeaturedLink key={link.id} link={link} structure={structure} />;
      })}

      <div
        className={cn('grid grid-flow-col', {
          'grid grid-rows-2 gap-5': structure === 'two-columns',
          'grid grid-rows-3 gap-2': structure === 'single-column',
        })}
      >
        {normalLinks.map((link) => {
          if (!link) return null;
          return <NormalLink key={link.id} link={link} structure={structure} />;
        })}
      </div>
    </div>
  );
};

type FeaturedImageProps = {
  link: DropdownLinkField;
  structure: 'single-column' | 'two-columns';
};

const StyleImage = {
  icon: 'p-4 bg-neutral-200 rounded-lg',
  image: 'rounded-md',
};

const FeaturedLink = (props: FeaturedImageProps) => {
  const { link } = props;
  const imageType = link.imageIcon?.type;

  const ImageElement = getDropdownImageElement(link, StyleImage[imageType || 'image']);

  return (
    <HawkLinkComponent
      link={link.link}
      className={cn('relative row-span-2 flex max-w-60 flex-1 flex-col gap-3 self-stretch', {
        'px-0': imageType === 'image',
        'bg-bege-dark rounded-lg py-2': !ImageElement || imageType !== 'image',
      })}
    >
      {ImageElement && (
        <div
          className={cn({
            'absolute h-full w-full transition-transform duration-300 hover:scale-105':
              imageType === 'image',
          })}
        >
          {ImageElement}
        </div>
      )}
      <div
        className={cn('z-10 mt-auto flex max-w-80 flex-col gap-1 rounded-xs px-4 text-white', {
          'mb-2': imageType === 'image',
        })}
      >
        <h6 className={cn('text-body text-h2_light text-right')}>{link.link.label}</h6>
        <p className={cn('line-clamp-2 text-right text-xs')}>{link.description}</p>
      </div>
    </HawkLinkComponent>
  );
};

const NormalLink = (props: FeaturedImageProps) => {
  const { link, structure } = props;
  const imageType = link.imageIcon?.type;

  const ImageElement = getDropdownImageElement(link, 'p-4 bg-neutral-200 rounded-lg');

  return (
    <HawkLinkComponent
      link={link.link}
      className={cn(
        'group flex w-80 flex-1 gap-4 border-b border-neutral-300 p-2 hover:border-neutral-900',
        {
          'px-0': imageType === 'image',
          'max-w-80 min-w-40': structure === 'single-column',
          'flex-col': structure === 'single-column' && imageType === 'image',
        }
      )}
    >
      {ImageElement && (structure === 'two-columns' || imageType === 'icon') && (
        <div className={cn('h-full')}>
          <div
            className={cn({
              'absolute h-full w-full': imageType === 'image',
              'transition-transform duration-300 group-hover:rotate-15': imageType === 'icon',
            })}
          >
            {ImageElement}
          </div>
        </div>
      )}
      <div
        className={cn('mt-auto flex w-full flex-col gap-1', {
          'mr-1 ml-auto': imageType === 'image',
        })}
      >
        <h6
          className={cn('text-body text-h2_light', {
            'text-left': structure === 'single-column',
            'text-right': structure === 'two-columns',
          })}
        >
          {link.link.label}
        </h6>
        {structure === 'two-columns' && (
          <p className={cn('line-clamp-2 text-right text-xs')}>{link.description}</p>
        )}
      </div>
    </HawkLinkComponent>
  );
};

export default DesktopDropdownV2;
