import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Language } from '@/i18n/settings';
import { getSingleNewsSlug } from '@/lib/payload/queries/news';
import { prepareMetadataInfo, getMetadataPageInfo } from '@/utils/metadata';
import { HawkStarsSection } from '@/components/layout';
import RichTextWrapper from '@/payload/components/RichText/RichTextWrapper';
import { LanguageProps } from '@/components/types';
import { Media } from '@/payload-types';
import { getImagePayloadUrl } from '@/lib/image';

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

  const { title, type, content, mainImage, publishedAt } = article;

  const image = getImagePayloadUrl(mainImage);
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

      {/* Article body */}
      <HawkStarsSection className='py-10 lg:py-14'>
        <div className='max-w-6xl'>
          <RichTextWrapper data={content} />
        </div>
      </HawkStarsSection>
    </>
  );
};

export default NewsSlugPage;
