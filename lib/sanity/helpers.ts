import { InternationalizedArrayString } from '@/projects/sanity/sanity.types';

export const extractInternationalI18nString = ({
  text,
  lng,
}: {
  text?: InternationalizedArrayString;
  lng: string;
}) => {
  const info = text?.find((item) => item._key == lng);
  return info?.value || '';
};

export const prepareSanityObjectQuery = (query: string | Record<string, string>) => {
  if (typeof query === 'string') return query;

  const preparedString = Object.entries(query)
    .map(([key, value]) => `"${key}": ${value}`)
    .join(',');

  return `{${preparedString}}`;
};
