import Link from 'next/link';
import { LuArrowRight, LuEye } from 'react-icons/lu';
import { getServerTranslation } from '@/i18n';
import { Language } from '@/i18n/settings';
import { Artist, Artwork } from '@/payload-types';
import { ImageMedia } from '@/payload/components/Media';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Placard } from '../ui';
import { artworkImage, artworkUrl, categoryAndYear, populated } from './helpers';

type ArtworkCardProps = {
  artwork: Artwork;
  lng: Language;
  /** `catalog`: full card with description and button. `compact`: image + title, for carousels and artist panels. */
  variant?: 'catalog' | 'compact';
  className?: string;
};

export async function ArtworkCard({
  artwork,
  lng,
  variant = 'catalog',
  className,
}: ArtworkCardProps) {
  const { t } = await getServerTranslation(lng, 'art');
  const image = artworkImage(artwork);
  const artist = populated<Artist>(artwork.artist);
  const href = artworkUrl(lng, artwork);
  const meta = categoryAndYear(artwork, lng);

  if (variant === 'compact') {
    return (
      <Link
        href={href}
        className={cn(
          'group border-art-line bg-art-pedestal/60 hover:border-art-gold/60 flex flex-col border p-3 transition-colors',
          className
        )}
      >
        <div className='bg-art-ebony relative aspect-4/3 overflow-hidden'>
          {image && (
            <ImageMedia
              resource={image}
              alt={artwork.title}
              fill
              sizes='(max-width: 768px) 80vw, 25vw'
              className='object-cover transition-transform duration-700 group-hover:scale-105'
            />
          )}
          {artwork.is_sold && (
            <Placard className='text-art-terracotta absolute bottom-2 left-2'>{t('sold')}</Placard>
          )}
        </div>
        <p className='font-art-serif text-art-text mt-3 text-base italic'>{artwork.title}</p>
        {meta && <p className='text-art-muted mt-1 text-xs'>{meta}</p>}
      </Link>
    );
  }

  return (
    <article
      className={cn(
        'group border-art-line bg-art-wall hover:border-art-gold/50 relative flex h-full flex-col border p-4 transition-colors md:p-5',
        className
      )}
    >
      {/* Gallery spotlight over the frame */}
      <span
        aria-hidden
        className='art-frame-light pointer-events-none absolute inset-x-8 -top-6 h-12 opacity-60 transition-opacity group-hover:opacity-100'
      />
      <Link
        href={href}
        className='border-art-brass/60 bg-art-ebony relative block aspect-4/5 overflow-hidden border-4 shadow-2xl shadow-black/60'
      >
        {image && (
          <ImageMedia
            resource={image}
            alt={artwork.title}
            fill
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            className='object-cover transition-transform duration-700 group-hover:scale-[1.03]'
          />
        )}
        {artwork.is_sold && (
          <Placard className='text-art-terracotta absolute top-3 right-3'>{t('sold')}</Placard>
        )}
      </Link>

      <div className='border-art-line bg-art-charcoal/70 mt-5 flex flex-1 flex-col border p-5'>
        {meta && <p className='art-eyebrow text-[10px]'>{meta}</p>}
        <h3 className='font-art-serif text-art-text mt-2 text-xl'>
          <Link href={href} className='hover:text-art-gold-bright'>
            {artwork.title}
          </Link>
        </h3>
        {artist && (
          <p className='font-art-serif text-art-text-2 mt-1 text-sm italic'>
            {t('catalog.by', { name: artist.name })}
          </p>
        )}
        {artwork.technique && (
          <p className='text-art-muted border-art-line mt-4 line-clamp-2 border-b pb-4 text-sm'>
            {artwork.technique}
          </p>
        )}
        <Button asChild variant='art-outline' size='art' className='mt-auto w-full'>
          <Link href={href}>
            <LuEye aria-hidden />
            {t('catalog.view')}
          </Link>
        </Button>
      </div>
    </article>
  );
}

/** Wider card used by the home page "Obras de Arte em Catálogo" carousel. */
export async function ArtworkShowcaseCard({ artwork, lng }: { artwork: Artwork; lng: Language }) {
  const { t } = await getServerTranslation(lng, 'art');
  const image = artworkImage(artwork);
  const artist = populated<Artist>(artwork.artist);
  const meta = categoryAndYear(artwork, lng);
  const href = artworkUrl(lng, artwork);

  return (
    <article className='group border-art-line bg-art-wall flex h-full flex-col border'>
      <Link
        href={href}
        className='border-art-brass/70 relative m-4 block aspect-square overflow-hidden border-2'
      >
        {image && (
          <ImageMedia
            resource={image}
            alt={artwork.title}
            fill
            sizes='(max-width: 768px) 85vw, 33vw'
            className='object-cover transition-transform duration-700 group-hover:scale-105'
          />
        )}
        {artwork.is_sold && (
          <Placard className='text-art-terracotta absolute top-3 left-3'>{t('sold')}</Placard>
        )}
      </Link>
      <div className='flex flex-1 flex-col px-5 pb-5'>
        {artist && <p className='art-eyebrow text-[10px]'>{artist.name}</p>}
        <h3 className='font-art-serif text-art-text mt-2 text-xl italic'>{artwork.title}</h3>
        {meta && <p className='text-art-muted mt-2 text-sm'>{meta}</p>}
        <div className='border-art-line mt-auto flex items-center justify-end gap-3 border-t pt-4'>
          <Button asChild variant='art-ghost' size='art'>
            <Link href={href}>
              {t('catalog.view')}
              <LuArrowRight aria-hidden />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
