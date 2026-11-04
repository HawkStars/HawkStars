/** Up to two initials for a partner without a logo: "Município de Pinhel" → "MP". */
export const getPartnerInitials = (name: string): string =>
  name
    .split(/\s+/)
    .filter((word) => word.length > 2 && word[0] === word[0].toUpperCase())
    .slice(0, 2)
    .map((word) => word[0])
    .join('') || name.slice(0, 2).toUpperCase();
