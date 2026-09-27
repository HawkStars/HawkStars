// One format for every artwork's dimensions, wherever they are shown.

export const DIMENSION_TYPES = [
  { value: 'unframed', label: { en: 'Unframed', pt: 'Sem moldura' } },
  { value: 'framed', label: { en: 'Framed', pt: 'Com moldura' } },
  { value: 'object', label: { en: 'Dimensions (W × L × H)', pt: 'Dimensão (L × C × A)' } },
] as const;

export type DimensionType = (typeof DIMENSION_TYPES)[number]['value'];

export type ArtworkDimensions = {
  dimension_type?: DimensionType | null;
  width_cm?: number | null;
  length_cm?: number | null;
  height_cm?: number | null;
};

const SUFFIX: Record<'unframed' | 'framed', { en: string; pt: string }> = {
  unframed: { en: 'unframed', pt: 'sem moldura' },
  framed: { en: 'framed', pt: 'com moldura' },
};

/**
 * "77 × 54,5 cm (sem moldura)", "80 × 60 cm (com moldura)" or
 * "52 × 28 × 24 cm" — null when the measurements are not filled in.
 */
export function formatDimensions(artwork: ArtworkDimensions, lng: 'pt' | 'en'): string | null {
  const type = artwork.dimension_type ?? 'unframed';
  const values =
    type === 'object'
      ? [artwork.width_cm, artwork.length_cm, artwork.height_cm]
      : [artwork.width_cm, artwork.length_cm];
  if (values.some((value) => value == null || value <= 0)) return null;

  const number = new Intl.NumberFormat(lng === 'en' ? 'en-GB' : 'pt-PT', {
    maximumFractionDigits: 1,
  });
  const measures = `${values.map((value) => number.format(value!)).join(' × ')} cm`;
  return type === 'object' ? measures : `${measures} (${SUFFIX[type][lng]})`;
}
