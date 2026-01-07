export const createPayloadExternalImage = (type: 'external', url: string, alt: string) => ({
  imageType: type,
  externalImage: url,
  alt: alt,
});

export const createPayloadLink = (
  type: 'custom' | 'reference',
  url: string,
  newTab: boolean,
  label: string
) => ({
  type,
  url,
  newTab,
  label,
});
