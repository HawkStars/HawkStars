'use client';

import React, { useState } from 'react';
import { useField, TextInput, FieldLabel } from '@payloadcms/ui';
import type { TextFieldClientProps } from 'payload';

/**
 * Custom Payload field component for the Instagram User ID field.
 *
 * Renders a standard text input alongside a "Fetch from token" button.
 * When clicked it calls GET /api/instagram/user-id, which uses the access
 * token already saved in Website Settings to resolve the numeric user ID
 * from the Instagram Graph API — so editors never need to look it up manually.
 *
 * Register in the field config:
 *   admin: { components: { Field: '@/payload/components/fields/InstagramUserIdField' } }
 */
export default function InstagramUserIdField(props: TextFieldClientProps) {
  const { field, path } = props;
  const { value, setValue } = useField<string>({ path });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(null);

  const fetchUserId = async () => {
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch('/api/instagram/user-id');
      const data = await res.json();

      if (!res.ok || data.error) {
        setStatus({ ok: false, message: data.error ?? 'Unknown error' });
        return;
      }

      setValue(data.userId);
      setStatus({ ok: true, message: `@${data.username} — ID saved` });
    } catch {
      setStatus({ ok: false, message: 'Request failed. Is the server running?' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='field-type text'>
      <FieldLabel
        htmlFor={`field-${path}`}
        label={field.label as string}
        required={field.required}
      />

      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <div style={{ flex: 1 }}>
          <TextInput
            path={path}
            value={value ?? ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
            placeholder='e.g. 123456789012345'
          />
        </div>

        <button
          type='button'
          onClick={fetchUserId}
          disabled={loading}
          className='btn btn--style-secondary btn--size-small'
          style={{ whiteSpace: 'nowrap', flexShrink: 0 }}
          title='Resolve user ID from the access token saved in Website Settings'
        >
          {loading ? 'Fetching…' : 'Fetch from token'}
        </button>
      </div>

      {/* Status feedback */}
      {status && (
        <p
          style={{
            marginTop: '6px',
            fontSize: '12px',
            color: status.ok
              ? 'var(--theme-success-500, #22c55e)'
              : 'var(--theme-error-500, #ef4444)',
          }}
        >
          {status.ok ? '✓' : '✗'} {status.message}
        </p>
      )}

      {/* Description */}
      {field.admin?.description && (
        <p className='field-description'>
          {typeof field.admin.description === 'string' ? field.admin.description : null}
        </p>
      )}
    </div>
  );
}
