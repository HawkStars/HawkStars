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
