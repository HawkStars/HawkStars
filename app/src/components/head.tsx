import Head from "next/head";

type MetadataProps = {
  title: string;
  description: string;
  image?: string;
};

const HawkMetadata = ({ title, description, image }: MetadataProps) => {
  return (
    <Head>
      <title>{`HawkStars - ${title}`}</title>
      <meta name="description" content={description} key="desc" />
      <meta property="og:title" content={`HawkStars - ${title}`} />
      <meta property="og:description" content={description} />
      {image && <meta property="og:image" content={image} />}
    </Head>
  );
};

export default HawkMetadata;
