import { Language } from '@/i18n/settings';
import { getRelatedNewsQuery } from '@/lib/payload/queries/news';
import { SectionHeader } from '../ui';
import { GalleryNewsCard } from './GalleryNewsCard';

type RelatedGalleryNewsProps = { relatedId: string; lng: Language; title: string };

/** News articles linked (via "Related Content") to an artwork, artist or curator. */
export default async function RelatedGalleryNews({
  relatedId,
  lng,
  title,
}: RelatedGalleryNewsProps) {
  const { docs } = await getRelatedNewsQuery(relatedId, lng);
  if (docs.length === 0) return null;

  return (
    <section className='border-art-line border-t px-4 py-16 lg:px-8 lg:py-20'>
      <div className='mx-auto max-w-7xl'>
        <SectionHeader title={title} />
        <div className='mt-10 grid gap-8 md:grid-cols-3'>
          {docs.map((article) => (
            <GalleryNewsCard key={article.id} article={article} lng={lng} />
          ))}
        </div>
      </div>
    </section>
  );
}
