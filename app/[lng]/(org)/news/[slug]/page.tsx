import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Language } from '@/i18n/settings';
import { getSingleNewsSlug } from '@/lib/payload/queries/news';
import { prepareMetadataInfo, getMetadataPageInfo } from '@/utils/metadata';
import { LanguageProps } from '@/components/types';
import { getImagePayloadUrl } from '@/lib/image';
import { ArticleJsonLd } from '@/components/seo/JsonLd';
import { BASE_URL } from '@/lib/constants';
import NewsSingleHero from '@/components/news/single/NewsSingleHero';
import NewsSingleHeroNoImage from '@/components/news/single/NewsSingleHeroNoImage';
import NewsSingleInformation from '@/components/news/single/NewsSingleInformation';
import NewsSingleGallery from '@/components/news/single/NewsSingleGallery';

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

  const { title, details, mainImage, publishedAt } = article;
  const heroImage = getImagePayloadUrl(mainImage);

  return (
    <>
      <ArticleJsonLd
        title={title}
        description={details?.text?.substring(0, 160) ?? undefined}
        url={`${BASE_URL}/${lng}/news/${slug}`}
        image={heroImage?.url || undefined}
        publishedAt={publishedAt ?? undefined}
        modifiedAt={article?.updatedAt ?? undefined}
        lng={lng as Language}
      />
      {/* ── Hero ── */}
      {heroImage ? (
        <NewsSingleHero {...article} heroImage={heroImage} lng={lng as Language} />
      ) : (
        <NewsSingleHeroNoImage {...article} lng={lng as Language} />
      )}

      <NewsSingleInformation details={details} />
      <NewsSingleGallery gallery={article.gallery} />
    </>
  );
};

export default NewsSlugPage;
