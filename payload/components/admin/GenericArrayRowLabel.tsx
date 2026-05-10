'use client';

import { useRowLabel } from '@payloadcms/ui';

const preferredKeys = [
  'title',
  'name',
  'label',
  'question',
  'text',
  'feature',
  'value',
  'year',
  'columnOne',
  'number',
  'phaseName',
  'subname',
  'url',
  'quote',
] as const;

const truncate = (value: string, maxLength = 60) => {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength - 3)}...`;
};

const getValueAsText = (value: unknown): string | null => {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed.length ? trimmed : null;
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  if (value && typeof value === 'object') {
    const valueAsRecord = value as Record<string, unknown>;
    const localized = getValueAsText(valueAsRecord.pt) || getValueAsText(valueAsRecord.en);

    if (localized) {
      return localized;
    }

    return (
      getValueAsText(valueAsRecord.label) ||
      getValueAsText(valueAsRecord.title) ||
      getValueAsText(valueAsRecord.name) ||
      getValueAsText(valueAsRecord.url)
    );
  }

  return null;
};

const GenericArrayRowLabel = () => {
  const { data } = useRowLabel<Record<string, unknown>>();

  if (!data) {
    return <div>Unnamed item</div>;
  }

  for (const key of preferredKeys) {
    const value = getValueAsText(data[key]);
    if (value) {
      return <div>{truncate(value)}</div>;
    }
  }

  return <div>Unnamed item</div>;
};

export default GenericArrayRowLabel;
