'use client';

import { useRowLabel } from '@payloadcms/ui';

type RowData = Record<string, unknown>;

type MakeRowLabelOptions = {
  /** Text shown when no title value is present. */
  fallback: string;
  /**
   * Extract the label text from the row data. Defaults to reading `data.title`.
   * Provide this for nested or differently-named fields.
   */
  getTitle?: (data: RowData) => unknown;
  /** Apply `text-transform: capitalize`. Defaults to true. */
  capitalize?: boolean;
};

/**
 * Factory for the many near-identical Payload admin array RowLabel components
 * that render a single title field with a fallback. Keeps each call site down to
 * one line while preserving that site's exact fallback text and styling.
 */
export const makeRowLabel = ({ fallback, getTitle, capitalize = true }: MakeRowLabelOptions) => {
  const RowLabel = () => {
    const { data } = useRowLabel<RowData>();
    const raw = getTitle ? getTitle(data ?? {}) : data?.title;
    const text = typeof raw === 'string' ? raw.trim() : '';

    return (
      <div style={capitalize ? { textTransform: 'capitalize' } : undefined}>{text || fallback}</div>
    );
  };

  return RowLabel;
};
