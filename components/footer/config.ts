import { HawkLink } from '../utils/HawkLink/config';

export type FooterColumn = {
  column: {
    title?: string | null;
    data?: HawkLink[] | null;
  };
};
