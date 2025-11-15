import { Metadata } from 'next';
import { getSinglePageSlug } from '@/lib/payload/queries/page';
import { LanguageProps } from '@/components/types';
import { notFound } from 'next/navigation';
import RichText from '@/payload/components/RichText';

type PageProps = {
  params: Promise<LanguageProps & { slug: string }>;
};

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const { lng, slug } = params;
  if (!slug) return {};
  const pageInformation = await getSinglePageSlug(slug, lng);
  if (!pageInformation) return {};

  const { title, description }: Metadata = pageInformation.meta || {
    title: undefined,
    description: undefined,
  };

  return {
    title: title || pageInformation.title,
    description: description,
  };
}

const Index = async (props: PageProps) => {
  const params = await props.params;
  const { lng, slug } = params;
  if (!slug) notFound();
  const pageInformation = await getSinglePageSlug(slug, lng);
  if (!pageInformation) notFound();

  return (
    <>
      <h1>{pageInformation.title}</h1>
      {pageInformation.layout && <RichText data={pageInformation.layout} />}
    </>
  );
};

export default Index;
