'use client';

import { useCallback, useEffect, useState } from 'react';
import { useDocumentInfo, useField, useLocale } from '@payloadcms/ui';
import type { TextFieldClientComponent } from 'payload';
import { getOtherLocalesDocs, subscribe } from './localeDocumentCache';

/** Locale we translate *from*. EN fields are filled from the PT source. */
const SOURCE_LOCALE = 'pt';
/** Only offer the button while editing this locale. */
const TARGET_LOCALE = 'en';

function resolveNestedValue(doc: Record<string, unknown>, fieldPath: string): string | null {
  const parts = fieldPath.split('.');
  let current: unknown = doc;
  for (const part of parts) {
    if (current == null || typeof current !== 'object') return null;
    current = (current as Record<string, unknown>)[part];
  }
  return typeof current === 'string' ? current : null;
}

/**
 * afterInput component injected on every localized text/textarea field.
 * When editing the EN locale, it shows a small button that machine-translates
 * the PT value into the field via `/api/translate`. The editor still reviews
 * and saves — nothing is persisted automatically.
 */
const TranslateInput: TextFieldClientComponent = (props) => {
  const { field, path } = props;
  const { localized } = field;
  const locale = useLocale();
  const { id, globalSlug, collectionSlug } = useDocumentInfo();
  const { setValue } = useField<string>({ path });

  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [, setTick] = useState(0);
  useEffect(() => subscribe(() => setTick((t) => t + 1)), []);

  const { loading, docs } = getOtherLocalesDocs(globalSlug, collectionSlug, id, locale.code);

  const sourceDoc = docs[SOURCE_LOCALE];
  const sourceValue = sourceDoc ? resolveNestedValue(sourceDoc, path) : null;

  const handleTranslate = useCallback(async () => {
    if (!sourceValue) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ text: sourceValue, from: SOURCE_LOCALE, to: TARGET_LOCALE }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as { translation?: string };
      if (typeof data.translation === 'string') {
        setValue(data.translation);
        setStatus('idle');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }, [sourceValue, setValue]);

  // Only relevant for localized fields while editing the target (EN) locale.
  if (!localized || locale.code !== TARGET_LOCALE) return null;
  // Needs a saved document so the PT value can be fetched.
  if (!globalSlug && !id) return null;

  const disabled = loading || status === 'loading' || !sourceValue;

  return (
    <div style={{ marginTop: '0.4rem' }}>
      <button
        type='button'
        onClick={handleTranslate}
        disabled={disabled}
        title={
          sourceValue
            ? 'Preencher com a tradução automática do Português'
            : 'Sem valor em Português para traduzir'
        }
        style={{
          fontSize: '0.75rem',
          padding: '0.25rem 0.6rem',
          borderRadius: '4px',
          border: '1px solid var(--theme-elevation-150, #ccc)',
          background: 'var(--theme-elevation-50, #f5f5f5)',
          color: 'var(--theme-text, #333)',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
        }}
      >
        {status === 'loading' ? 'A traduzir…' : '↳ Traduzir do PT'}
      </button>
      {status === 'error' && (
        <span
          style={{ marginLeft: '0.5rem', fontSize: '0.75rem', color: 'var(--theme-error, #c00)' }}
        >
          Falha na tradução. Tenta novamente.
        </span>
      )}
    </div>
  );
};

export default TranslateInput;
