import Link from 'next/link';
import { getServerTranslation } from '@/i18n';
import { Language } from '@/i18n/settings';
import { Artist, Artwork } from '@/payload-types';
import { ImageMedia } from '@/payload/components/Media';
import { artistUrl } from '../artwork/helpers';
import { artworkDisciplines } from './helpers';

/** Portrait card for the home page artists carousel. */
type ArtistCardProps = { artist: Artist; works: Artwork[]; lng: Language };

export async function ArtistCard({ artist, works, lng }: ArtistCardProps) {
  const { t } = await getServerTranslation(lng, 'art');
  const disciplines = artworkDisciplines(works, lng);

  return (
    <Link
      href={artistUrl(lng, artist)}
      className='group border-art-line bg-art-wall block border p-4'
    >
      <div className='bg-art-ebony relative aspect-3/4 overflow-hidden'>
        <ImageMedia
          resource={artist.image}
          alt={artist.name}
          fill
          sizes='(max-width: 768px) 80vw, 25vw'
          className='object-cover grayscale transition duration-700 group-hover:scale-105 group-hover:grayscale-0'
        />
      </div>
      {disciplines.length > 0 && (
        <p className='art-eyebrow mt-4 text-[10px]'>{disciplines.join(' • ')}</p>
      )}
      <h3 className='font-art-serif text-art-text group-hover:text-art-gold-bright mt-2 text-2xl transition-colors'>
        {artist.name}
      </h3>
      <p className='text-art-muted mt-1 text-xs'>
        {[artist.location, t('home.pieces_count', { count: works.length })]
          .filter(Boolean)
          .join(' · ')}
      </p>
    </Link>
  );
}
