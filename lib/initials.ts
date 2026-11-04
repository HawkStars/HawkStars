/**
 * Up to two initials for a monogram when there is no image, from the first and last
 * significant words: "Ana Júlia Ramos" → "AR", "Município de Pinhel" → "MP".
 * Short or lower-case words ("de", "da") are skipped.
 */
export const getInitials = (name: string): string => {
  const words = name
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 2 && word[0] === word[0].toUpperCase());

  if (words.length === 0) return name.trim().slice(0, 2).toUpperCase();
  if (words.length === 1) return words[0][0].toUpperCase();
  return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
};
