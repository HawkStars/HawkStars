import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Language } from '@/i18n/settings';
import { getSingleNewsSlug } from '@/lib/payload/queries/news';
import { prepareMetadataInfo, getMetadataPageInfo } from '@/utils/metadata';
import { HawkStarsSection } from '@/components/layout';
import RichTextWrapper from '@/payload/components/RichText/RichTextWrapper';
import { LanguageProps } from '@/components/types';

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

  return (
    <>
      {/* Hero image */}
      <HawkStarsSection className='relative h-[420px] overflow-hidden p-0 lg:h-[560px]'>
        <Image
          src={(mainImage as { url: string }).url}
          alt={(mainImage as { alt?: string }).alt ?? title}
          fill
          className='object-cover'
          priority
        />
        <div className='absolute inset-0 bg-black/40' />
      </HawkStarsSection>

      {/* Article header */}
      <HawkStarsSection className='bg-bege-light py-8 lg:py-12'>
        <div className='flex flex-col gap-3 max-w-3xl'>
          <span className='text-body_small uppercase tracking-widest text-primary'>
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
        <div className='max-w-3xl'>
          <RichTextWrapper data={content} />
        </div>
      </HawkStarsSection>
    </>
  );
};

export default NewsSlugPage;
