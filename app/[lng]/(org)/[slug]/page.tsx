import { Metadata } from 'next';
import { getSinglePageSlug } from '@/lib/payload/queries/page';
import { prepareMetadataInfo } from '@/utils/metadata';
import { Language } from '@/i18n/settings';
import { LanguageProps } from '@/components/types';
import { notFound } from 'next/navigation';
import RichText from '@/payload/components/RichText';
import { Suspense } from 'react';

type PageProps = {
  params: Promise<LanguageProps & { slug: string }>;
};

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const { lng, slug } = params;
  if (!slug) return {};
  const pageInformation = await getSinglePageSlug(slug, lng);
  if (!pageInformation) return {};

  return prepareMetadataInfo({
    title: pageInformation.meta?.title || pageInformation.title,
    description: pageInformation.meta?.description,
    url: `/${slug}`,
    lng: lng as Language,
  });
}

// The boundary was inside the async body, wrapping only already-resolved data —
// it has to sit above the `params` await (a dynamic API here, since `[slug]` has
// no `generateStaticParams`) to buy anything.
const Index = (props: PageProps) => (
  <Suspense fallback={<></>}>
    <PageContent params={props.params} />
  </Suspense>
);

const PageContent = async ({ params }: { params: PageProps['params'] }) => {
  const { lng, slug } = await params;
  if (!slug) notFound();
  const pageInformation = await getSinglePageSlug(slug, lng);
  if (!pageInformation) notFound();

  if (!pageInformation.layout) return null;

  return <RichText data={pageInformation.layout} />;
};

export default Index;
