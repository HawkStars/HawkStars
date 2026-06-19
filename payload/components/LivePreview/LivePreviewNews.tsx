'use client';

import React from 'react';
import { useLivePreview } from '@payloadcms/live-preview-react';
import type { News } from '@/payload-types';
import { getImagePayloadUrl } from '@/lib/image';
import NewsSingleHero from '@/components/news/single/NewsSingleHero';
import NewsSingleHeroNoImage from '@/components/news/single/NewsSingleHeroNoImage';
import NewsSingleInformation from '@/components/news/single/NewsSingleInformation';
import NewsSingleGallery from '@/components/news/single/NewsSingleGallery';
import { Language } from '@/i18n/settings';

type PreviewNewsData = {
  article: News;
  lng: Language;
};

type LivePreviewNewsProps = {
  initialData: PreviewNewsData;
  serverURL: string;
};

export const LivePreviewNews: React.FC<LivePreviewNewsProps> = ({ initialData, serverURL }) => {
  const { data } = useLivePreview<PreviewNewsData>({
    initialData,
    serverURL,
    depth: 2,
  });

  if (!data) return null;
  const { article, lng } = data;
  const { details, mainImage, gallery } = article || {};
  const image = getImagePayloadUrl(mainImage);

  return (
    <>
      {image ? (
        <NewsSingleHero {...article} heroImage={image} lng={lng as Language} />
      ) : (
        <NewsSingleHeroNoImage {...article} lng={lng as Language} />
      )}

      <NewsSingleInformation details={details} />
      <NewsSingleGallery gallery={gallery} />
    </>
  );
};
