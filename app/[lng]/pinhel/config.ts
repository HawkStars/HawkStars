import { SlideshowImage } from '@/components/utils/Slideshow/types';

// images
import pinhel1 from '@/public/images/pinhel/foto1.jpeg';
import pinhel2 from '@/public/images/pinhel/foto2.jpeg';
import pinhel3 from '@/public/images/pinhel/foto3.jpeg';
import pinhel4 from '@/public/images/pinhel/foto4.jpeg';

export const pinhelUrls = {
  en: {
    historical_center: 'https://www.cm-pinhel.pt/wp-content/uploads/2021/01/mapa-pinhel41B_ING.pdf',
    invest_pinhel:
      'https://www.cm-pinhel.pt/doc/investir-pinhel/guia-investidor/guia-investidor_en.pdf',
  },
  pt: {
    historical_center: 'https://www.cm-pinhel.pt/wp-content/uploads/2021/01/mapa-pinhel41B_PT.pdf',
    invest_pinhel: undefined,
  },
  es: {
    historical_center: 'https://www.cm-pinhel.pt/wp-content/uploads/2021/01/mapa-pinhel41B_ESP.pdf',
    invest_pinhel: 'https://www.cm-pinhel.pt/investir-pinhel/guia-do-investidor/',
  },
  fr: {
    historical_center: undefined,
    invest_pinhel:
      'https://www.cm-pinhel.pt/doc/investir-pinhel/guia-investidor/guia-investidor_fr.pdf',
  },
} as {
  [x: string]: {
    historical_center?: string;
    invest_pinhel?: string;
  };
};

export const pinhelSlideshowImages: SlideshowImage[] = [
  { url: pinhel1 },
  { url: pinhel2 },
  { url: pinhel3 },
  { url: pinhel4 },
];
