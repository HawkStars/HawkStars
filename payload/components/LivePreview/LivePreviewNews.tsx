'use client';

import React from 'react';
import { useLivePreview } from '@payloadcms/live-preview-react';
import type { News, Media } from '@/payload-types';
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
  const { text, sections } = data.details || {};
  const gallery = data.gallery;

  const hasGalleryImages =
    gallery &&
    ((gallery.internalImages && gallery.internalImages.length > 0) ||
      (gallery.externalImages && gallery.externalImages.length > 0));

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

      {/* Description */}
      {text && (
        <div style={{ padding: '0 1rem 1.5rem', maxWidth: '720px' }}>
          <p style={{ whiteSpace: 'pre-line', lineHeight: 1.7, color: '#374151' }}>{text}</p>
        </div>
      )}

      {/* Sections */}
      {sections && sections.length > 0 && (
        <div style={{ padding: '0 1rem 2rem', maxWidth: '720px' }}>
          {sections.map((section, i) => (
            <div key={i} style={{ marginBottom: '2rem' }}>
              {section.title && (
                <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                  {section.title}
                </h2>
              )}
              {section.text && (
                <p style={{ whiteSpace: 'pre-line', lineHeight: 1.7, color: '#374151' }}>
                  {section.text}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Gallery */}
      {hasGalleryImages && (
        <div
          style={{
            padding: '0 1rem 2rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1rem',
          }}
        >
          {gallery.internalImages?.map((item, i) => {
            const media = item.image as Media;
            return media?.url ? (
              <img
                key={`int-${i}`}
                src={media.url}
                alt={media.alt || data.title || ''}
                style={{
                  width: '100%',
                  aspectRatio: '3/2',
                  objectFit: 'cover',
                  borderRadius: '8px',
                }}
              />
            ) : null;
          })}
          {gallery.externalImages?.map((item, i) => (
            <img
              key={`ext-${i}`}
              src={item.url}
              alt={item.alt || data.title || ''}
              style={{
                width: '100%',
                aspectRatio: '3/2',
                objectFit: 'cover',
                borderRadius: '8px',
              }}
            />
          ))}
        </div>
      )}
    </article>
  );
};
