// Plain data — no Payload imports — so it can be used both by the collection
// field config (admin select options) and by frontend pages that need to
// render a category's label, without pulling Payload into the client bundle.
// Order here is the canonical display order: it must be followed wherever
// categories are listed, not just in the admin dropdown.
export const ART_CATEGORIES = [
  { value: 'drawing', label: { en: 'Drawing', pt: 'Desenho' } },
  { value: 'painting', label: { en: 'Painting', pt: 'Pintura' } },
  { value: 'sculpture', label: { en: 'Sculpture', pt: 'Escultura' } },
  { value: 'photography', label: { en: 'Photography', pt: 'Fotografia' } },
  { value: 'screen_printing', label: { en: 'Screen Printing', pt: 'Serigrafia' } },
  { value: 'installation', label: { en: 'Installation', pt: 'Instalação' } },
  { value: 'ceramics', label: { en: 'Ceramics', pt: 'Cerâmica' } },
  { value: 'tapestry', label: { en: 'Tapestry', pt: 'Tapeçaria' } },
  { value: 'jewelry', label: { en: 'Jewelry', pt: 'Joalharia' } },
  { value: 'artist_book', label: { en: "Artist's Book", pt: 'Livro de Artista' } },
  { value: 'other', label: { en: 'Other', pt: 'Outros' } },
] as const;

export type ArtCategoryValue = (typeof ART_CATEGORIES)[number]['value'];

export const getArtCategoryLabel = (
  value: string | null | undefined,
  locale: 'en' | 'pt'
): string | undefined => ART_CATEGORIES.find((category) => category.value === value)?.label[locale];
