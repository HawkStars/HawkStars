'use client';

import React from 'react';
import { useLivePreview } from '@payloadcms/live-preview-react';
import type { News } from '@/payload-types';
import RichText from '@/payload/components/RichText';
import { getImagePayloadUrl } from '@/lib/image';

type LivePreviewNewsProps = {
  initialData: News;
  serverURL: string;
};

export const LivePreviewNews: React.FC<LivePreviewNewsProps> = ({ initialData, serverURL }) => {
  const { data } = useLivePreview<News>({
    initialData,
    serverURL,
    depth: 2,
  });

  if (!data) return null;

  const image = getImagePayloadUrl(data.mainImage);

  return (
    <article>
      {image && (
        <div
          style={{ position: 'relative', width: '100%', maxHeight: '480px', overflow: 'hidden' }}
        >
          <img
            src={image.url}
            alt={image.alt || data.title || ''}
            style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
          />
        </div>
      )}
      <header style={{ padding: '2rem 1rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>{data.title}</h1>
        {data.type && (
          <span
            style={{
              display: 'inline-block',
              marginTop: '0.5rem',
              padding: '0.25rem 0.75rem',
              fontSize: '0.75rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              borderRadius: '4px',
              background: '#f1f5f9',
              color: '#475569',
            }}
          >
            {data.type}
          </span>
        )}
      </header>
      {data.content && (
        <div style={{ padding: '0 1rem 2rem' }}>
          <RichText data={data.content} />
        </div>
      )}
    </article>
  );
};
