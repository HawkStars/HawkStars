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
    });
  }

  return prepareMetadataInfo({ title: article.title });
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

  return (
    <>
      {/* Hero image */}
      {image && (
        <HawkStarsSection className='relative h-105 overflow-hidden p-0 lg:h-140'>
          <Image
            src={image?.url || ''}
            alt={image?.alt || title}
            fill
            className='object-cover'
            priority
          />
          <div className='absolute inset-0 bg-black/40' />
        </HawkStarsSection>
      )}

      {/* Article header */}
      <HawkStarsSection className='bg-bege-light py-8 lg:py-12'>
        <div className='flex max-w-3xl flex-col gap-3'>
          <span className='text-body_small text-primary tracking-widest uppercase'>
            {type.replace('_', ' ')}
          </span>
          <h1 className='text-h1_semibold'>{title}</h1>
          {publishedAt && (
            <p className='text-body_small text-gray-500'>
              {new Date(publishedAt).toLocaleDateString(lng, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          )}
        </div>
      </HawkStarsSection>

      {/* Description */}
      {text && (
        <HawkStarsSection className='py-10 lg:py-14'>
          <div className='max-w-3xl'>
            <p className='text-body_regular leading-relaxed whitespace-pre-line text-gray-700'>
              {text}
            </p>
          </div>
        </HawkStarsSection>
      )}

      {/* Sections */}
      {sections && sections.length > 0 && (
        <HawkStarsSection className='py-6 lg:py-10'>
          <div className='flex max-w-3xl flex-col gap-10'>
            {sections.map((section, i) => (
              <div key={i} className='flex flex-col gap-3'>
                {section.title && <h2 className='text-h2_light text-green'>{section.title}</h2>}
                {section.text && (
                  <p className='text-body_regular leading-relaxed whitespace-pre-line text-gray-700'>
                    {section.text}
                  </p>
                )}
              </div>
            ))}
          </div>
        </HawkStarsSection>
      )}

      {/* Photo Gallery */}
      {hasGalleryImages && (
        <HawkStarsSection className='py-10 lg:py-14'>
          <div className='grid grid-cols-2 gap-4 md:grid-cols-3'>
            {gallery.internalImages?.map((item, i) => {
              const media = item.image as Media;
              return media?.url ? (
                <Image
                  key={`int-${i}`}
                  src={media.url}
                  alt={media.alt || title}
                  width={media.width || 600}
                  height={media.height || 400}
                  className='aspect-3/2 w-full rounded-lg object-cover'
                />
              ) : null;
            })}
            {gallery.externalImages?.map((item, i) => (
              <Image
                key={`ext-${i}`}
                src={item.url}
                alt={item.alt || title}
                width={600}
                height={400}
                className='aspect-3/2 w-full rounded-lg object-cover'
              />
            ))}
          </div>
        </HawkStarsSection>
      )}
    </>
  );
};

export default NewsSlugPage;
