import Link from 'next/link';
import { LuImages } from 'react-icons/lu';
import { getServerTranslation } from '@/i18n';
import { Language } from '@/i18n/settings';
import { Artist, Artwork } from '@/payload-types';
import { ImageMedia } from '@/payload/components/Media';
import { SITE_GET_URLS, transformUrl } from '@/utils/paths';
import { Button } from '@/components/ui/button';
import { ArtworkCard } from '../artwork/ArtworkCard';
import { artistUrl, richTextToPlain } from '../artwork/helpers';
import { artworkDisciplines } from './helpers';

const WORKS_SHOWN = 2;

/** One artist on the artists page: portrait + bio on the left, their works on the right. */
type ArtistRowProps = { artist: Artist; works: Artwork[]; lng: Language };

export default async function ArtistRow({ artist, works, lng }: ArtistRowProps) {
  const { t } = await getServerTranslation(lng, 'art');
  const disciplines = artworkDisciplines(works, lng);

  return (
    <article className='art-panel grid gap-8 p-6 md:p-10 lg:grid-cols-2'>
      <div className='flex flex-col gap-6'>
        <div className='flex items-start gap-5'>
          <ImageMedia
            resource={artist.image}
            alt={artist.name}
            width={112}
            height={112}
            className='border-art-line aspect-square w-24 shrink-0 border object-cover grayscale md:w-28'
          />
          <div>
            {disciplines.length > 0 && (
              <p className='art-eyebrow text-[10px]'>{disciplines.join(' • ')}</p>
            )}
            <h2 className='font-art-serif text-art-text mt-2 text-3xl md:text-4xl'>
              <Link href={artistUrl(lng, artist)} className='hover:text-art-gold-bright'>
                {artist.name}
              </Link>
            </h2>
            {artist.location && <p className='text-art-muted mt-1 text-xs'>{artist.location}</p>}
          </div>
        </div>
        <p className='text-art-text-2 text-lg leading-relaxed'>
          {richTextToPlain(artist.description, 420)}
        </p>
        <div className='mt-auto flex flex-wrap gap-3'>
          {works.length > 0 && (
            <Button asChild variant='art' size='art'>
              <Link href={transformUrl(lng, SITE_GET_URLS.artwork, { artist: artist.name })}>
                {t('artists.see_works')}
              </Link>
            </Button>
          )}
          <Button asChild variant='art-outline' size='art'>
            <Link href={artistUrl(lng, artist)}>{t('artists.profile')}</Link>
          </Button>
        </div>
      </div>

      <div className='border-art-line border p-5 md:p-6'>
        <p className='font-art-serif text-art-text border-art-line flex items-center gap-3 border-b pb-4 text-sm tracking-wider uppercase'>
          <LuImages aria-hidden className='text-art-gold' />
          {t('artists.works_title')}
        </p>
        {works.length > 0 ? (
          <div className='mt-5 grid grid-cols-2 gap-4'>
            {works.slice(0, WORKS_SHOWN).map((artwork) => (
              <ArtworkCard key={artwork.id} artwork={artwork} lng={lng} variant='compact' />
            ))}
          </div>
        ) : (
          <p className='text-art-muted mt-5 text-sm'>{t('artists.no_works')}</p>
        )}
      </div>
    </article>
  );
}
