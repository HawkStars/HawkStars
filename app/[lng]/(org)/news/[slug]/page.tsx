import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Language } from '@/i18n/settings';
import { getSingleNewsSlug } from '@/lib/payload/queries/news';
import { prepareMetadataInfo } from '@/utils/metadata';
import { LanguageProps } from '@/components/types';
import { getImagePayloadUrl } from '@/lib/image';
import { ArticleJsonLd } from '@/components/seo/JsonLd';
import { BASE_URL } from '@/lib/constants';
import NewsSingleHero from '@/components/news/single/NewsSingleHero';
import NewsSingleHeroNoImage from '@/components/news/single/NewsSingleHeroNoImage';
import NewsSingleInformation from '@/components/news/single/NewsSingleInformation';
import NewsSingleGallery from '@/components/news/single/NewsSingleGallery';
import { Suspense } from 'react';

type NewsSlugPageProps = {
  params: Promise<LanguageProps & { slug: string }>;
};

export async function generateMetadata(props: NewsSlugPageProps): Promise<Metadata> {
  const params = await props.params;
  const { lng, slug } = params;

  const article = await getSingleNewsSlug(slug, lng as Language);
  if (!article) return {};

  return prepareMetadataInfo({
    title: article.meta?.title ?? article.title,
    description: article.meta?.description,
    // SEO override (a Media upload) first, then the article's own ImageType hero.
    image: article.mainImage,
    url: `/news/${slug}`,
    lng: lng as Language,
  });
}

// There is no `generateStaticParams` for [slug], so `params` is a dynamic API
// here and awaiting it in the page body keeps the route blocking however well
// `getSingleNewsSlug` is cached. The promise is handed to a child that awaits it
// inside the boundary instead, which is what `instant = false` was papering over.
const NewsSlugPage = (props: NewsSlugPageProps) => (
  <Suspense fallback={<></>}>
    <NewsArticleContent params={props.params} />
  </Suspense>
);

const NewsArticleContent = async ({ params }: { params: NewsSlugPageProps['params'] }) => {
  const { lng, slug } = await params;

  const article = await getSingleNewsSlug(slug, lng as Language);
  if (!article) notFound();

  const { title, mainImage, publishedAt } = article;
  const heroImage = getImagePayloadUrl(mainImage);

  return (
    <>
      <ArticleJsonLd
        title={title}
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

      <NewsSingleInformation {...article} />
      <NewsSingleGallery gallery={article.gallery} />
    </>
  );
};

export default NewsSlugPage;
