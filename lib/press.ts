/** Press coverage of Hawk Stars and its v1.0, EuroHawk. Used by /history and /press. */
export type PressLink = { label: string; url: string };

export const pressLinks: Record<'eurohawk' | 'ukraine' | 'hawkstars', PressLink[]> = {
  hawkstars: [
    {
      label: 'YouTube — We Are EU Stars! (vídeo-reportagem, 2025)',
      url: 'https://www.youtube.com/watch?v=sYbiLTRjNCc',
    },
  ],
  eurohawk: [
    {
      label: 'Beira.pt — EuroHawk comemora 1.º aniversário',
      url: 'https://beira.pt/portal/noticias/sociedade/associacao-juvenil-falcoes-da-europa-eurohawk-comemora-1o-aniversario/',
    },
    {
      label: 'O Interior — 35 jovens europeus debatem mobilidade juvenil',
      url: 'https://ointerior.pt/arquivo/35-jovens-europeus-debatem-mobilidade-juvenil/',
    },
    {
      label: 'Beira.pt — Hawk Festival 17 arranca hoje em Pinhel',
      url: 'https://beira.pt/portal/noticias/sociedade/hawk-festival-17-arranca-hoje-pinhel/',
    },
    { label: 'Hawk Festival — Facebook', url: 'https://www.facebook.com/hawkfestival' },
  ],
  ukraine: [
    {
      label: 'Altitude FM — FNEE promove ajuda humanitária',
      url: 'https://www.altitude.fm/actualidade/fnee-promove-ajuda-humanitaria-juntos-pela-ucrania/',
    },
    {
      label: 'Altitude FM — Camiões rumam em direção à Ucrânia',
      url: 'https://www.altitude.fm/actualidade/camioes-com-ajuda-humanitaria-rumam-em-direcao-a-ucrania/',
    },
    {
      label: 'O Interior — 80 toneladas de bens partiram da Guarda',
      url: 'https://ointerior.pt/sociedade/cerca-de-80-toneladas-de-bens-essenciais-partiram-da-guarda-para-a-ucrania/',
    },
    {
      label: 'Politécnico da Guarda — Recolha de bens para a Ucrânia',
      url: 'https://politecnicoguarda.pt/politecnico-da-guarda-recolhe-bens-para-acao-humanitaria-na-ucrania/',
    },
  ],
};
