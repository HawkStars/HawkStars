'use client';

import { useCallback, useEffect, useState } from 'react';
import { useDocumentInfo, useLocale } from '@payloadcms/ui';
import { TextFieldClientComponent } from 'payload';
import {
  ALL_LOCALES,
  getOtherLocalesDocs,
  subscribe,
  type LocaleCode,
} from './localeDocumentCache';

function resolveNestedValue(doc: Record<string, unknown>, fieldPath: string): string | null {
  const parts = fieldPath.split('.');
  let current: unknown = doc;
  for (const part of parts) {
    if (current == null || typeof current !== 'object') return null;
    current = (current as Record<string, unknown>)[part];
  }
  return typeof current === 'string' ? current : null;
}

const ShowInput: TextFieldClientComponent = (props) => {
  const { field, path } = props;
  const { localized } = field;
  const locale = useLocale();
  const { id, globalSlug, collectionSlug } = useDocumentInfo();

  // Force re-render when cache resolves
  const [, setTick] = useState(0);
  useEffect(() => subscribe(() => setTick((t) => t + 1)), []);

  const { loading, docs } = getOtherLocalesDocs(globalSlug, collectionSlug, id, locale.code);

  const getValueForLocale = useCallback(
    (loc: LocaleCode): string | null => {
      const doc = docs[loc];
      if (!doc) return null;
      return resolveNestedValue(doc, path);
    },
    [docs, path]
  );

  if (!localized) return null;

  const otherLocales = ALL_LOCALES.filter((loc) => loc !== locale.code);

  return (
    <div
      style={{
        marginTop: '0.5rem',
        fontSize: '0.8rem',
        color: '#888',
        display: 'flex',
        gap: '0.75rem',
        flexWrap: 'wrap',
      }}
    >
      {loading ? (
        <span>Loading locale values...</span>
      ) : (
        otherLocales.map((loc) => {
          const val = getValueForLocale(loc);
          return (
            <span key={loc} style={{ opacity: val ? 1 : 0.5 }}>
              <strong style={{ textTransform: 'uppercase' }}>{loc}:</strong> {val || <em>empty</em>}
            </span>
          );
        })
      )}
    </div>
  );
};

export default ShowInput;
