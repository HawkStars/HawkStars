import type { Access, AccessArgs } from 'payload';

type isOnlyPortugueseLocale = (args: AccessArgs) => boolean;

export const onlyPortugueseLocale: isOnlyPortugueseLocale = ({ req: { locale } }) => {
  return locale === 'pt';
};
