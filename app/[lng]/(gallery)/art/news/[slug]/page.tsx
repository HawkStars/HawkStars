import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LuArrowLeft } from 'react-icons/lu';
import { getServerTranslation } from '@/i18n';
import { LanguageProps } from '@/components/types';
import { prepareMetadataInfo } from '@/utils/metadata';
import { SITE_GET_URLS, transformUrl } from '@/utils/paths';
import { BASE_URL } from '@/lib/constants';
import { getImagePayloadUrl } from '@/lib/image';
import { getSingleNewsSlug } from '@/lib/payload/queries/news';
import { ImageMedia } from '@/payload/components/Media';
import { ArticleJsonLd } from '@/components/seo/JsonLd';
import { ArtRichText } from '@/components/art/ui/ArtRichText';
import { formatNewsDate } from '@/components/art/news/GalleryNewsCard';
import { readingMinutes } from '@/components/art/artwork/helpers';
import ArticleRelations from '@/components/art/news/ArticleRelations';

type GalleryArticlePageProps = { params: Promise<LanguageProps & { slug: string }> };

export async function generateMetadata(props: GalleryArticlePageProps): Promise<Metadata> {
  const { lng, slug } = await props.params;
  const article = await getSingleNewsSlug(slug, lng);
  if (!article) return {};

  return prepareMetadataInfo({
    title: article.meta?.title ?? article.title,
    description: article.meta?.description,
    image: getImagePayloadUrl(article.mainImage)?.url,
    url: `${SITE_GET_URLS.gallery_news}/${slug}`,
    lng,
  });
}

/** Any published news article, rendered in the gallery theme (used by the gallery feed and "Related News"). */
export default async function GalleryArticlePage(props: GalleryArticlePageProps) {
  const { lng, slug } = await props.params;
  const [article, { t }] = await Promise.all([
    getSingleNewsSlug(slug, lng),
    getServerTranslation(lng, 'art'),
  ]);
  if (!article) notFound();

  const heroImage = getImagePayloadUrl(article.mainImage);
  const galleryImages = (article.gallery?.internalImages ?? []).map((item) => item.image);

  return (
    <>
      <ArticleJsonLd
        title={article.title}
        url={`${BASE_URL}/${lng}${SITE_GET_URLS.gallery_news}/${slug}`}
        image={heroImage?.url || undefined}
        publishedAt={article.publishedAt ?? undefined}
        modifiedAt={article.updatedAt ?? undefined}
        lng={lng}
      />

      <div className='border-art-line border-b px-4 py-5 lg:px-8'>
        <Link
          href={transformUrl(lng, SITE_GET_URLS.gallery_news)}
          className='text-art-gold-bright hover:text-art-text mx-auto flex max-w-7xl items-center gap-2 text-xs tracking-[0.15em] uppercase'
        >
          <LuArrowLeft aria-hidden />
          {t('news.back')}
        </Link>
      </div>

      <article className='art-spotlight px-4 pt-14 pb-20 lg:px-8'>
        <header className='mx-auto max-w-4xl'>
          <p className='art-eyebrow flex items-center gap-3'>
            <span aria-hidden className='bg-art-terracotta h-1.5 w-1.5 rounded-full' />
            {t(`news.types.${article.type}`)}
            {article.publishedAt && (
              <time dateTime={article.publishedAt} className='text-art-muted'>
                · {formatNewsDate(article.publishedAt, lng)}
              </time>
            )}
            <span className='text-art-muted'>
              · {t('news.reading_time', { count: readingMinutes(article.details?.text) })}
            </span>
          </p>
          <h1 className='art-display mt-6 md:text-6xl'>{article.title}</h1>
          {article.lead && (
            <p className='font-art-serif text-art-text-2 mt-6 text-xl leading-relaxed italic md:text-2xl'>
              {article.lead}
            </p>
          )}
        </header>

        {heroImage && (
          <figure className='border-art-line bg-art-wall mx-auto mt-12 max-w-5xl border'>
            <div className='relative aspect-video'>
              <ImageMedia
                resource={article.mainImage}
                alt={heroImage.alt || article.title}
                fill
                preload
                sizes='(max-width: 1024px) 100vw, 1024px'
                className='object-cover'
              />
            </div>
            {!article.showCoverAtEnd && (article.mainImageCaption || article.mainImageCredit) && (
              <figcaption className='border-art-line flex flex-col gap-1 border-t px-6 py-4'>
                {article.mainImageCaption && (
                  <span className='text-art-text-2 text-sm'>{article.mainImageCaption}</span>
                )}
                {article.mainImageCredit && (
                  <span className='art-eyebrow text-art-muted text-[10px]'>
                    {article.mainImageCredit}
                  </span>
                )}
              </figcaption>
            )}
          </figure>
        )}

        {article.details?.text && (
          <ArtRichText
            data={article.details.text}
            className='art-article first-letter:font-art-serif first-letter:text-art-text mx-auto mt-14 max-w-3xl text-lg first-letter:float-left first-letter:mr-3 first-letter:text-7xl first-letter:leading-none'
            lng={lng}
          />
        )}

        {/* Opt-in ("Usar a imagem de capa… no fim"): the whole, uncropped photo. */}
        {heroImage && article.showCoverAtEnd && (
          <figure className='border-art-line bg-art-wall mx-auto mt-16 max-w-5xl border p-3 md:p-4'>
            <ImageMedia
              resource={article.mainImage}
              alt={heroImage.alt || article.title}
              sizes='(max-width: 1024px) 100vw, 1024px'
              className='h-auto w-full'
            />
            {(article.mainImageCaption || article.mainImageCredit) && (
              <figcaption className='flex flex-col gap-1 px-3 pt-4 pb-1'>
                {article.mainImageCaption && (
                  <span className='text-art-text-2 text-sm'>{article.mainImageCaption}</span>
                )}
                {article.mainImageCredit && (
                  <span className='art-eyebrow text-art-muted text-[10px]'>
                    {article.mainImageCredit}
                  </span>
                )}
              </figcaption>
            )}
          </figure>
        )}

        {galleryImages.length > 0 && (
          <div className='mx-auto mt-16 grid max-w-5xl grid-cols-2 gap-4 md:grid-cols-3'>
            {galleryImages.map((image, index) => (
              <div
                key={index}
                className='border-art-line relative aspect-square overflow-hidden border'
              >
                <ImageMedia
                  resource={image}
                  alt=''
                  fill
                  sizes='(max-width: 768px) 50vw, 33vw'
                  className='object-cover'
                />
              </div>
            ))}
          </div>
        )}
      </article>

      <ArticleRelations article={article} lng={lng} />
    </>
  );
}
