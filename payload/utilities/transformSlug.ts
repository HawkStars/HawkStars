const transformSlug = (slug: string): string => {
  if (!slug) return '';
  let transformedSlug = slug.toLowerCase();

  // Replace spaces and underscores with hyphens
  transformedSlug = transformedSlug.replace(/[\s_]+/g, '-');

  // Remove any non-alphanumeric characters (except hyphens)
  transformedSlug = transformedSlug.replace(/[^a-z0-9-]/g, '');

  // Remove leading and trailing hyphens
  transformedSlug = transformedSlug.replace(/^-+|-+$/g, '');

  return transformedSlug;
};

export default transformSlug;
