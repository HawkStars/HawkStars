import Link from 'next/link';
import type { IconType } from 'react-icons';
import { LuArrowUpRight } from 'react-icons/lu';
import { cn } from '@/lib/utils';
import { getImagePayloadUrl } from '@/lib/image';
import { ImageMedia } from '@/payload/components/Media';
import type { ImageType } from '@/payload-types';
import logoMark from '@/public/images/logos/logo-mark.svg';

export type ListingMeta = {
  icon: IconType;
  text: string;
  /** Machine-readable date, when the line is a date. */
  dateTime?: string;
  /** Optional prefix, e.g. "Project duration". */
  label?: string;
};

export type ListingDateChip = { day: string; month: string };

export type ListingCardProps = {
  href: string;
  title: string;
  image?: ImageType | null;
  imageAlt?: string;
  /** Type label shown as a pill on the image. */
  badge?: string | null;
  /** Calendar tile on the image (events). */
  dateChip?: ListingDateChip | null;
  meta?: ListingMeta[];
  description?: string | null;
  ctaLabel?: string;
  /** Wide, horizontal card that spans the whole grid row — the first item of a list. */
  featured?: boolean;
  /** Small label above the title of a featured card, e.g. "Latest news". */
  featuredLabel?: string;
  preload?: boolean;
  headingLevel?: 'h2' | 'h3';
};

/** Grid used by every listing (news, projects, events and their archives). */
export const LISTING_GRID = 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8';

/** A featured card spans the full row of `LISTING_GRID`. */
const FEATURED_SPAN = 'sm:col-span-2 lg:col-span-3';

/**
 * The one card used by the news, projects and events listings, in the same language as
 * the home page's pillar cards: a 4:3 image that zooms on hover, a type pill over the
 * image, date/location lines with icons, and an arrow that nudges up-right on hover.
 * Items without an image get a warm placeholder with the Hawk Stars symbol so the grid
 * never shows a gap.
 */
const ListingCard = ({
  href,
  title,
  image,
  imageAlt,
  badge,
  dateChip,
  meta = [],
  description,
  ctaLabel,
  featured: wantsFeatured = false,
  featuredLabel,
  preload = false,
  headingLevel: Heading = 'h2',
}: ListingCardProps) => {
  const resolved = image ? getImagePayloadUrl(image) : null;
  const hasImage = Boolean(resolved?.url);
  // A wide card with only the placeholder symbol reads as a hole, so feature image items only.
  const featured = wantsFeatured && hasImage;

  return (
    <article className={cn('h-full', featured && FEATURED_SPAN)}>
      <Link
        href={href}
        className={cn(
          'group card card-hover-lg focus-visible:ring-green flex h-full flex-col overflow-hidden bg-white transition-[translate,box-shadow] duration-500 hover:-translate-y-1 focus-visible:ring-2 focus-visible:outline-hidden',
          featured && 'lg:grid lg:grid-cols-12'
        )}
      >
        <div
          className={cn(
            'bg-bege-dark relative aspect-4/3 w-full overflow-hidden',
            featured && 'sm:aspect-video lg:col-span-7 lg:aspect-auto lg:min-h-96'
          )}
        >
          {hasImage ? (
            <ImageMedia
              resource={image}
              alt={imageAlt || resolved?.alt || title}
              fill
              preload={preload}
              sizes={
                featured
                  ? '(min-width: 1024px) 680px, 100vw'
                  : '(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw'
              }
              className='object-cover transition-transform duration-700 group-hover:scale-105'
            />
          ) : (
            <div className='flex h-full items-center justify-center'>
              <ImageMedia src={logoMark} alt='' width={88} className='opacity-25 grayscale' />
            </div>
          )}

          {badge && (
            <span className='text-eyebrow text-terracotta-dark absolute top-4 left-4 rounded-full bg-white/95 px-3 py-1.5 shadow-sm backdrop-blur-sm'>
              {badge}
            </span>
          )}

          {dateChip && (
            <span
              aria-hidden='true'
              className='absolute top-4 right-4 flex min-w-14 flex-col items-center rounded-lg bg-white px-2.5 py-2 text-center shadow-md'
            >
              <span className='font-display text-terracotta-dark text-2xl leading-none font-semibold tabular-nums'>
                {dateChip.day}
              </span>
              <span className='text-eyebrow mt-1 text-black/60'>{dateChip.month}</span>
            </span>
          )}
        </div>

        <div
          className={cn(
            'flex flex-1 flex-col gap-3 p-6',
            featured && 'lg:col-span-5 lg:justify-center lg:gap-4 lg:p-10'
          )}
        >
          {featured && featuredLabel && (
            <p className='text-eyebrow text-green flex items-center gap-2.5'>
              <span aria-hidden='true' className='bg-green block h-0.5 w-7' />
              {featuredLabel}
            </p>
          )}

          <Heading
            className={cn(
              'group-hover:text-green line-clamp-3 transition-colors',
              featured ? 'text-h2_bold' : 'text-h3_semibold'
            )}
          >
            {title}
          </Heading>

          {description && (
            <p
              className={cn(
                'text-sm leading-relaxed text-black/70',
                featured ? 'line-clamp-4 lg:text-base' : 'line-clamp-2'
              )}
            >
              {description}
            </p>
          )}

          {meta.length > 0 && (
            <ul className='flex flex-col gap-1.5 text-sm text-black/70'>
              {meta.map(({ icon: Icon, text, dateTime, label }) => (
                <li key={`${label ?? ''}${text}`} className='flex items-start gap-2'>
                  <Icon
                    aria-hidden='true'
                    className={cn(
                      'mt-0.5 size-4 shrink-0',
                      dateTime ? 'text-terracotta-dark' : 'text-green'
                    )}
                  />
                  <span>
                    {label && <span className='font-medium text-black'>{label}: </span>}
                    {dateTime ? <time dateTime={dateTime}>{text}</time> : text}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {ctaLabel && (
            <span className='text-green mt-auto inline-flex items-center gap-1 pt-2 text-sm font-semibold'>
              {ctaLabel}
              <LuArrowUpRight
                aria-hidden='true'
                className='transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5'
              />
            </span>
          )}
        </div>
      </Link>
    </article>
  );
};

export default ListingCard;
