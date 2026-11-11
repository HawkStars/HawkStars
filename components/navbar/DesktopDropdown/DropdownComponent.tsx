import React from 'react';
import { LuArrowRight, LuArrowUpRight } from 'react-icons/lu';
import HawkLinkComponent from '@/components/utils/HawkLink';
import { DropdownNavLink } from '@/payload-types';
import { DropdownLinkField, getDropdownImageElement } from './utils';
import { cn } from '@/lib/utils';
import { useMainAppContext } from '@/utils/contexts/AppProvider';

type NavbarTone = 'default' | 'erasmus';

interface DropdownComponentProps {
  title?: string | null;
  structure: 'single-column' | 'two-columns';
  links?: { dropdownNavLink?: DropdownNavLink | null } | null;
}

/** Per-variant classes; the Erasmus pages keep their EU-blue navbar. */
const TONE = {
  default: {
    card: 'border-bege-dark bg-white text-black',
    eyebrow: 'text-green',
    rule: 'bg-green',
    item: 'hover:bg-bege-light',
    tile: 'bg-bege-dark text-green group-hover:bg-green group-hover:text-white',
    label: 'group-hover:text-green',
    description: 'text-black/60',
    divider: 'border-bege-dark',
  },
  erasmus: {
    // Darker than the blue bar and page, so the panel reads as a layer above them.
    card: 'border-white/10 bg-erasmus-dark text-white',
    eyebrow: 'text-erasmus-gold',
    rule: 'bg-erasmus-gold',
    item: 'hover:bg-white/10',
    tile: 'bg-white/10 text-white group-hover:bg-erasmus-gold group-hover:text-erasmus-dark',
    label: '',
    description: 'text-white/70',
    divider: 'border-white/15',
  },
} as const;

/**
 * The desktop mega-menu card: the menu's name as an eyebrow, featured links as image
 * cards on the left, and the remaining links as icon rows (two columns when long).
 */
const DropdownComponent: React.FC<DropdownComponentProps> = ({ title, structure, links }) => {
  const { navbarVariant } = useMainAppContext();
  const tone: NavbarTone = navbarVariant === 'erasmus' ? 'erasmus' : 'default';
  const styles = TONE[tone];

  const visibleLinks = (links?.dropdownNavLink ?? []).filter((link) => link.visible);
  if (visibleLinks.length === 0) return null;

  const featuredLinks = visibleLinks.filter((link) => link.featured);
  const normalLinks = visibleLinks.filter((link) => !link.featured);
  const twoColumns = structure === 'two-columns' && normalLinks.length > 4;

  return (
    <div
      className={cn(
        'mx-auto flex w-fit max-w-6xl gap-6 rounded-xl border p-5 shadow-lg xl:p-6',
        styles.card
      )}
    >
      {featuredLinks.length > 0 && (
        <div className='flex flex-col gap-3'>
          {featuredLinks.map((link) => (
            <FeaturedLinkCard key={link.id} link={link} />
          ))}
        </div>
      )}

      {normalLinks.length > 0 && (
        <div
          className={cn(
            'flex min-w-72 flex-col',
            featuredLinks.length > 0 && cn('border-l pl-6', styles.divider)
          )}
        >
          {title && (
            <p className={cn('text-eyebrow mb-3 flex items-center gap-2.5 px-3', styles.eyebrow)}>
              <span aria-hidden='true' className={cn('block h-0.5 w-6', styles.rule)} />
              {title}
            </p>
          )}
          <ul className={cn('grid gap-1', twoColumns && 'grid-cols-2 gap-x-4')}>
            {normalLinks.map((link) => (
              <li key={link.id}>
                <NormalLinkItem link={link} tone={tone} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

type LinkProps = {
  link: DropdownLinkField;
  tone?: NavbarTone;
};

/** Image (or green gradient) card with white text and a hover zoom. */
const FeaturedLinkCard: React.FC<LinkProps> = ({ link }) => {
  const imageType = link.imageIcon?.type;
  const ImageElement = getDropdownImageElement(
    link,
    'transition-transform duration-500 group-hover:scale-105'
  );
  const hasImage = Boolean(ImageElement && imageType === 'image');

  return (
    <HawkLinkComponent
      link={link.link}
      className={cn(
        'group focus-visible:ring-green relative flex min-h-36 w-60 flex-col justify-end overflow-hidden rounded-xl p-4 text-white shadow-sm transition-[translate,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-md focus-visible:ring-2 focus-visible:outline-hidden',
        !hasImage && 'from-green to-green-dark bg-linear-to-br'
      )}
    >
      {hasImage && <div className='absolute inset-0'>{ImageElement}</div>}
      {/* Keeps the white text readable on any photo. */}
      {hasImage && (
        <div className='from-green-dark/90 via-green-dark/40 absolute inset-0 bg-linear-to-t to-transparent' />
      )}
      {ImageElement && imageType === 'icon' && (
        <div className='absolute top-4 right-4 text-white/70 transition-transform duration-300 group-hover:scale-110 group-hover:text-white'>
          {ImageElement}
        </div>
      )}

      <div className='relative z-10'>
        <span className='flex items-center gap-1.5 text-base font-semibold'>
          {link.link.label}
          <LuArrowUpRight
            aria-hidden='true'
            className='size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5'
          />
        </span>
        {link.description && (
          <span className='mt-1 line-clamp-2 block text-sm text-white/85'>{link.description}</span>
        )}
      </div>
    </HawkLinkComponent>
  );
};

/** One menu row: icon tile, label and an optional one-line description. */
const NormalLinkItem: React.FC<LinkProps> = ({ link, tone = 'default' }) => {
  const styles = TONE[tone];
  const ImageElement = getDropdownImageElement(link, 'rounded');

  return (
    <HawkLinkComponent
      link={link.link}
      className={cn(
        'group focus-visible:ring-green flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-hidden',
        styles.item
      )}
    >
      <span
        aria-hidden='true'
        className={cn(
          'relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-lg transition-colors duration-200 [&_svg]:size-4.5',
          styles.tile
        )}
      >
        {ImageElement ?? (
          <LuArrowRight className='transition-transform duration-200 group-hover:translate-x-0.5' />
        )}
      </span>

      <span className='flex flex-col'>
        <span className={cn('text-sm font-semibold transition-colors', styles.label)}>
          {link.link.label}
        </span>
        {link.description && (
          <span className={cn('line-clamp-1 text-xs', styles.description)}>{link.description}</span>
        )}
      </span>
    </HawkLinkComponent>
  );
};

export default DropdownComponent;
