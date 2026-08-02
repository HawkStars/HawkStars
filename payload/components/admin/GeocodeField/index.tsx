'use client';

import { useCallback, useMemo, useState } from 'react';
import { useField, useLocale } from '@payloadcms/ui';
import type { UIFieldClientComponent } from 'payload';

type GeocodeResult = {
  latitude: number;
  longitude: number;
  displayName: string;
  importance: number | null;
};

type GeocodeFieldProps = {
  /** Sibling field holding the text to look up (e.g. `address`, `city`). */
  sourceField?: string;
  latField?: string;
  lngField?: string;
};

/** Turns `layout.2.geocode` into `layout.2.address`. */
const siblingPath = (path: string, name: string) => {
  const parts = path.split('.');
  parts[parts.length - 1] = name;
  return parts.join('.');
};

const round6 = (n: number) => Math.round(n * 1e6) / 1e6;

/**
 * "Find coordinates" button for any field group that stores a latitude and a
 * longitude alongside a human-entered address.
 *
 * Calls `/api/geocode` (a server-side Nominatim proxy), lists the candidate
 * matches, and writes the chosen one into the sibling coordinate fields. The
 * editor always confirms the match before anything is set — rural Portuguese
 * addresses geocode unevenly, and a confidently wrong pin is worse than an
 * empty one. Nothing is persisted until the document itself is saved.
 */
const GeocodeField: UIFieldClientComponent = (props) => {
  const { path } = props;
  const {
    sourceField = 'address',
    latField = 'latitude',
    lngField = 'longitude',
  } = (props as typeof props & GeocodeFieldProps) ?? {};

  const locale = useLocale();

  const { value: source } = useField<string>({ path: siblingPath(path, sourceField) });
  const { value: lat, setValue: setLat } = useField<number>({
    path: siblingPath(path, latField),
  });
  const { value: lng, setValue: setLng } = useField<number>({
    path: siblingPath(path, lngField),
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<GeocodeResult[] | null>(null);
  const [chosen, setChosen] = useState<string | null>(null);

  const query = useMemo(() => (source ?? '').replace(/\s+/g, ' ').trim(), [source]);
  const disabled = status === 'loading' || query.length < 3;

  const handleLookup = useCallback(async () => {
    setStatus('loading');
    setError(null);
    setResults(null);
    setChosen(null);

    try {
      const res = await fetch(
        `/api/geocode?q=${encodeURIComponent(query)}&lang=${encodeURIComponent(locale.code)}`,
        { credentials: 'include' }
      );

      const data = (await res.json()) as { results?: GeocodeResult[]; error?: string };

      if (!res.ok) {
        setError(data.error ?? `Lookup failed (${res.status}).`);
        setStatus('error');
        return;
      }

      if (!data.results?.length) {
        setError('No match found. Try a simpler address, or enter the coordinates manually.');
        setStatus('error');
        return;
      }

      setResults(data.results);
      setStatus('idle');
    } catch {
      setError('Could not reach the geocoding service. Enter the coordinates manually.');
      setStatus('error');
    }
  }, [query, locale.code]);

  const handleChoose = useCallback(
    (result: GeocodeResult) => {
      setLat(round6(result.latitude));
      setLng(round6(result.longitude));
      setChosen(result.displayName);
      setResults(null);
    },
    [setLat, setLng]
  );

  const hasCoordinates = typeof lat === 'number' && typeof lng === 'number';

  return (
    <div className='field-type' style={{ marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        <button
          type='button'
          className='btn btn--style-secondary btn--size-small'
          onClick={handleLookup}
          disabled={disabled}
          style={{ margin: 0 }}
          title={
            query.length < 3
              ? 'Fill in the address first'
              : 'Look up the coordinates for this address'
          }
        >
          {status === 'loading' ? 'Searching…' : 'Find coordinates'}
        </button>

        {hasCoordinates && !chosen && (
          <span style={{ fontSize: '0.8rem', color: 'var(--theme-elevation-600)' }}>
            Currently {lat}, {lng}
          </span>
        )}

        {chosen && (
          <span style={{ fontSize: '0.8rem', color: 'var(--theme-success-600, #2a7)' }}>
            Set to {lat}, {lng} — {chosen}
          </span>
        )}
      </div>

      {error && (
        <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--theme-error-500)' }}>
          {error}
        </p>
      )}

      {results && (
        <div style={{ marginTop: '0.75rem' }}>
          <p style={{ fontSize: '0.8rem', marginBottom: '0.4rem' }}>
            Pick the correct match — check it before saving:
          </p>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: '0.25rem' }}>
            {results.map((result) => (
              <li key={`${result.latitude},${result.longitude}`}>
                <button
                  type='button'
                  onClick={() => handleChoose(result)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '0.5rem 0.65rem',
                    borderRadius: '4px',
                    border: '1px solid var(--theme-elevation-150)',
                    background: 'var(--theme-elevation-50)',
                    color: 'var(--theme-text)',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    lineHeight: 1.4,
                  }}
                >
                  <span style={{ display: 'block' }}>{result.displayName}</span>
                  <span style={{ color: 'var(--theme-elevation-600)' }}>
                    {round6(result.latitude)}, {round6(result.longitude)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <p
            style={{
              marginTop: '0.5rem',
              fontSize: '0.7rem',
              color: 'var(--theme-elevation-500)',
            }}
          >
            Data © OpenStreetMap contributors, via Nominatim.
          </p>
        </div>
      )}
    </div>
  );
};

export default GeocodeField;
