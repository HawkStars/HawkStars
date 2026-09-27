import Link from 'next/link';
import { getServerTranslation } from '@/i18n';
import { Language } from '@/i18n/settings';
import { Artist, Artwork, Curator, News } from '@/payload-types';
import { ImageMedia } from '@/payload/components/Media';
import { SectionHeader } from '../ui';
import { ArtworkCard } from '../artwork/ArtworkCard';
import { artistUrl, curatorUrl, populated } from '../artwork/helpers';

type Person = { href: string; name: string; image: Artist['image']; role: string };

/** Artworks, artists and curators an article links to via "Relacionado na Galeria de Arte". */
export default async function ArticleRelations({ article, lng }: { article: News; lng: Language }) {
  const relations = article.galleryRelations ?? [];
  if (relations.length === 0) return null;

  const { t } = await getServerTranslation(lng, 'art');
  const artworks: Artwork[] = [];
  const people: Person[] = [];

  for (const relation of relations) {
    if (relation.relationTo === 'artworks') {
      const artwork = populated<Artwork>(relation.value);
      if (artwork) artworks.push(artwork);
    } else if (relation.relationTo === 'artists') {
      const artist = populated<Artist>(relation.value);
      if (artist)
        people.push({
          href: artistUrl(lng, artist),
          name: artist.name,
          image: artist.image,
          role: t('artwork.artist'),
        });
    } else {
      const curator = populated<Curator>(relation.value);
      if (curator)
        people.push({
          href: curatorUrl(lng, curator),
          name: curator.name,
          image: curator.image,
          role: curator.role || t('curator.badge'),
        });
    }
  }

  if (artworks.length === 0 && people.length === 0) return null;

  return (
    <section className='border-art-line border-t px-4 py-16 lg:px-8'>
      <div className='mx-auto max-w-5xl'>
        <SectionHeader eyebrow={t('news.related_eyebrow')} title={t('news.related_title')} />

        {people.length > 0 && (
          <ul className='mt-8 grid gap-4 sm:grid-cols-2'>
            {people.map((person) => (
              <li key={person.href}>
                <Link
                  href={person.href}
                  className='group border-art-line bg-art-wall hover:border-art-gold/50 flex items-center gap-4 border p-4 transition-colors'
                >
                  <ImageMedia
                    resource={person.image}
                    alt={person.name}
                    width={64}
                    height={64}
                    className='aspect-square w-16 shrink-0 object-cover grayscale'
                  />
                  <span className='flex flex-col'>
                    <span className='art-eyebrow text-[10px]'>{person.role}</span>
                    <span className='font-art-serif text-art-text group-hover:text-art-gold-bright text-xl'>
                      {person.name}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {artworks.length > 0 && (
          <div className='mt-8 grid grid-cols-2 gap-4 md:grid-cols-3'>
            {artworks.map((artwork) => (
              <ArtworkCard key={artwork.id} artwork={artwork} lng={lng} variant='compact' />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
