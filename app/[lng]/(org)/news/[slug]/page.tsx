import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Language } from '@/i18n/settings';
import { getSingleNewsSlug } from '@/lib/payload/queries/news';
import { prepareMetadataInfo, getMetadataPageInfo } from '@/utils/metadata';
import { HawkStarsSection } from '@/components/layout';
import { LanguageProps } from '@/components/types';
import { getImagePayloadUrl } from '@/lib/image';
import { Media } from '@/payload-types';
import { ArticleJsonLd } from '@/components/seo/JsonLd';
import { BASE_URL } from '@/lib/constants';

export const revalidate = 600; // invalidate every 10 minutes

type NewsSlugPageProps = {
  params: Promise<LanguageProps & { slug: string }>;
};

export async function generateMetadata(props: NewsSlugPageProps): Promise<Metadata> {
  const params = await props.params;
  const { lng, slug } = params;

  const article = await getSingleNewsSlug(slug, lng as Language);
  if (!article) return getMetadataPageInfo(lng as Language, 'news');

  if (article.meta) {
    return prepareMetadataInfo({
      title: article.meta.title ?? article.title,
      description: article.meta.description,
      image: article.meta.image,
      urlPath: `/news/${slug}`,
      lng: lng as Language,
    });
  }

  return prepareMetadataInfo({
    title: article.title,
    urlPath: `/news/${slug}`,
    lng: lng as Language,
  });
}

const NewsSlugPage = async (props: NewsSlugPageProps) => {
  const params = await props.params;
  const { lng, slug } = params;

  const article = await getSingleNewsSlug(slug, lng as Language);
  if (!article) notFound();

  const { title, type, details, gallery, mainImage, publishedAt } = article;

  const image = getImagePayloadUrl(mainImage);
  const { text, sections } = details || {};

  const hasGalleryImages =
    gallery &&
    ((gallery.internalImages && gallery.internalImages.length > 0) ||
      (gallery.externalImages && gallery.externalImages.length > 0));

  const formattedDate = publishedAt
    ? new Date(publishedAt).toLocaleDateString(lng, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <>
      <ArticleJsonLd
        title={title}
        description={details?.text?.substring(0, 160) ?? undefined}
        url={`${BASE_URL}/${lng}/news/${slug}`}
        image={image?.url || undefined}
        publishedAt={publishedAt ?? undefined}
        modifiedAt={article.updatedAt ?? undefined}
        lng={lng as Language}
      />
      {/* ── Hero ── */}
      {image ? (
        <HawkStarsSection padding='none' className='relative h-105 overflow-hidden lg:h-140'>
          <Image
            src={image.url || ''}
            alt={image.alt || title}
            fill
            className='object-cover'
            priority
          />
          {/* Gradient overlay for readability */}
          <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent' />

          {/* Title overlay on hero */}
          <div className='absolute inset-x-0 bottom-0 px-4 pb-10 xl:px-40'>
            <div className='mx-auto max-w-4xl'>
              <span className='bg-green mb-4 inline-block rounded-sm px-3 py-1 text-xs font-bold tracking-widest text-white uppercase'>
                {type.replace('_', ' ')}
              </span>
              <h1 className='text-h1_semibold text-white drop-shadow-lg'>{title}</h1>
              {formattedDate && (
                <p className='mt-3 text-sm font-light text-white/70'>{formattedDate}</p>
              )}
            </div>
          </div>
        </HawkStarsSection>
      ) : (
        /* Fallback header when no image */
        <HawkStarsSection className='bg-green px-4 py-16 xl:px-40'>
          <div className='mx-auto max-w-4xl'>
            <span className='mb-4 inline-block rounded-sm border border-white/30 bg-white/10 px-3 py-1 text-xs font-bold tracking-widest text-white uppercase'>
              {type.replace('_', ' ')}
            </span>
            <h1 className='text-h1_semibold text-white'>{title}</h1>
            {formattedDate && (
              <p className='mt-3 text-sm font-light text-white/70'>{formattedDate}</p>
            )}
          </div>
        </HawkStarsSection>
      )}

      {/* ── Description ── */}
      {text && (
        <HawkStarsSection className='py-12 lg:py-16'>
          <div className='mx-auto max-w-3xl'>
            {/* Decorative accent bar */}
            <div className='bg-green mb-8 h-1 w-16 rounded-full' />
            <p className='text-body_regular leading-relaxed whitespace-pre-line text-gray-700'>
              {text}
            </p>
          </div>
        </HawkStarsSection>
      )}

      {/* ── Sections ── */}
      {sections && sections.length > 0 && (
        <HawkStarsSection className='bg-bege-light py-12 lg:py-16'>
          <div className='mx-auto flex max-w-3xl flex-col gap-12'>
            {sections.map((section, i) => (
              <div key={i} className='relative flex gap-6'>
                {/* Section number accent */}
                <div className='hidden shrink-0 sm:block'>
                  <span className='text-green/10 font-serif text-6xl leading-none font-black select-none'>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>

                {/* Section content */}
                <div className='border-green/20 flex flex-col gap-3 border-l-2 pl-6'>
                  {section.title && <h2 className='text-h2_bold text-green'>{section.title}</h2>}
                  {section.text && (
                    <p className='text-body_regular leading-relaxed whitespace-pre-line text-gray-700'>
                      {section.text}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </HawkStarsSection>
      )}

      {/* ── Photo Gallery ── */}
      {hasGalleryImages && (
        <HawkStarsSection className='py-12 lg:py-16'>
          <div className='mx-auto max-w-5xl'>
            <div className='mb-8 flex items-center gap-3'>
              <div className='bg-green h-1 w-8 rounded-full' />
              <h2 className='text-h2_light text-green'>Galeria</h2>
            </div>
            <div className='grid grid-cols-2 gap-3 md:grid-cols-3'>
              {gallery.internalImages?.map((item, i) => {
                const media = item.image as Media;
                return media?.url ? (
                  <div
                    key={`int-${i}`}
                    className='group relative aspect-3/2 overflow-hidden rounded-lg'
                  >
                    <Image
                      src={media.url}
                      alt={media.alt || title}
                      width={media.width || 600}
                      height={media.height || 400}
                      className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-105'
                    />
                    <div className='absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10' />
                  </div>
                ) : null;
              })}
              {gallery.externalImages?.map((item, i) => (
                <div
                  key={`ext-${i}`}
                  className='group relative aspect-3/2 overflow-hidden rounded-lg'
                >
                  <Image
                    src={item.url}
                    alt={item.alt || title}
                    width={600}
                    height={400}
                    className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-105'
                  />
                  <div className='absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10' />
                </div>
              ))}
            </div>
          </div>
        </HawkStarsSection>
      )}
    </>
  );
};

export default NewsSlugPage;
