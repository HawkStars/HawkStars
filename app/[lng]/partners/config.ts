import { SocialContact } from '../../../models/social';

export type PartnersInfo = {
  image: string;
  title: string;
  description: string;
  contacts: SocialContact[];
  type: 'national' | 'international';
  country?: string;
};

export const CURRENT_PARTNERS = [
  {
    image: '/images/partners/logo/AAA.jpg',
    title: 'AAA - Associação Amigos de Almeida',
    description: `partners.aaa`,
    contacts: [],
    type: 'national',
  },
  {
    image: '/images/partners/logo/ARKTIC.jpg',
    title:
      'ARKTIC - Alliance for Research, Knowledge, Transfer & International Cooperation',
    description: '',
    contacts: [],
    type: 'international',
    country: 'Germany',
  },
  {
    image: '/images/partners/logo/associacao_juvenil.jpg',
    title: 'Associação Juvenil Guarda a Terra',
    description: `A Hawk Stars NGO para a Educação, Inovação e Desenvolvimento Social estabeleceu uma nova parceria com a Associação Juvenil Guarda a Terra. A parceria tem por base a colaboração em atividades de ambas as associações e a colaboração específica em atividades internacionais da Hawk Stars como o Programa Erasmus.`,
    contacts: [
      { type: 'facebook', url: 'https://www.facebook.com/guardaaterra' },
    ],
    type: 'national',
  },
  {
    image: '/images/partners/logo/cap_magellan.jpg',
    title: 'Cap Magellan',
    description: `A Hawk Stars Associação para a Educação, Inovação e Desenvolvimento Social tem o prazer de anunciar a todos os sócios, seguidores e amigos a realização de uma parceria de colaboração de longo prazo com a Association Culturelle Cap Magellan.
    Fundada em Paris a 24 de novembro de 1991, a Cap Magellan é a primeira associação de jovens lusófonos e lusófilos, tendo como seu primordial objetivo a promoção da língua e a cultura portuguesas, em França e na Europa.
    A Parceria é gerida pelos nosso membro em Paris, e Vice-Presidente Hawk Stars Dr. David Silva, no que diz respeito à colaboração em eventos da CAPMagellan e da HawkStars, bem como a parceria formal em projetos internacionais na área da juventude, promovidos na Europa, em Portugal e em França.
    Trabalhamos recentemente e estritamente com a Cap Magellan na organização do Encontro Europeu de Jovens Lusodescendentes.`,
    contacts: [
      { type: 'instagram', url: 'https://www.instagram.com/cap_magellan/' },
      { type: 'facebook', url: 'https://www.facebook.com/capmagellan1' },
      {
        type: 'website',
        url: 'https://capmagellan.com/',
      },
    ],
    type: 'international',
    country: 'France',
  },
  {
    image: '/images/partners/logo/comunitatea_plus.jpg',
    title: 'Comunitatea Plus',
    description: '',
    contacts: [
      { type: 'instagram', url: 'https://www.instagram.com/comunitateaplus/' },
      { type: 'facebook', url: 'https://www.facebook.com/ComunitateaPlus' },
    ],
    type: 'international',
    country: 'Moldova',
  },
  {
    image: '/images/partners/logo/creative_youth_center.jpg',
    title: 'Creative Youth Centre',
    description: '',
    contacts: [
      {
        type: 'instagram',
        url: 'https://www.instagram.com/creative_youth_centre/',
      },
    ],
    type: 'international',
    country: 'Ukraine',
  },
  {
    image: '/images/partners/logo/FNEE.jpg',
    title: `FNEE - Federação Nacional dos Estudos Europeus`,
    description: `A Hawk Stars NGO é um resultado de longo prazo de uma Associação Juvenil anteriormente existente, nomeadamente a EuroHawk -- Associação Juvenil Falcões da Europa, criada em 2015 e extinta em 2019. A EuroHawk foi uma uma das associação fundadoras da Federação Nacional dos Estudos Europeus, que tem sede em Coimbra, sendo agora substituida pela Hawk Stars.
    A Hawk Stars como versão 2.0 de um projecto juvenil que evoluiu para uma Associação em parte constituída por jovens, mas com objetivos maiores e de longo prazo é agora Associada e Parceira da FNEE, reconhecendo a importância que são os Assuntos Europeus em Portugal, sendo parte ativa da sua dissiminação e oportunidades. Recentemente a Hawk Stars esteve também envolvida na organização do Encontro Nacional de Estudos Europeus, que decorreu no Fundão. #LONGTERMPARTNERSHIP`,
    contacts: [
      { type: 'instagram', url: 'https://www.instagram.com/cap_magellan/' },
      { type: 'facebook', url: 'https://www.facebook.com/capmagellan1' },
    ],
    type: 'national',
  },
  {
    image: '/images/partners/logo/JUBUX.jpg',
    title: 'JUBUX - JUGEND, BILDUNG UND JULTUR E.V',
    description: '',
    contacts: [
      { type: 'instagram', url: 'https://www.instagram.com/jubuk.de/' },
      { type: 'facebook', url: 'https://www.facebook.com/JubukGermany' },
      {
        type: 'website',
        url: 'https://jubuk.wordpress.com/',
      },
    ],
    type: 'international',
    country: 'Germany',
  },
  {
    image: '/images/partners/logo/SIR.jpg',
    title: 'SIR - Stowarzyszenie Inicjatyw Regionalnych',
    description:
      'No âmbito da cooperação profícua e constante entre as duas organizações e desde início da nossa organização, a Hawk Stars - Associação para a Educação, Inovação e Desenvolvimento Social e a SIR Poland consideraram a afirmação de um protocolo para cooperação de longo termo, na área da formação de professores e mobilidade internacional de adultos e jovens.',
    contacts: [
      { type: 'instagram', url: 'https://www.instagram.com/sirpoland_' },
      {
        type: 'facebook',
        url: 'https://www.facebook.com/StowarzyszenieInicjatywRegionalnych',
      },
    ],
    type: 'international',
    country: 'Poland',
  },
  {
    image: '/images/partners/logo/youth_mix_ngo.jpg',
    title: 'Youth Mix NGO',
    description: '',
    contacts: [
      { type: 'instagram', url: 'https://www.instagram.com/youth_mix/' },
      { type: 'facebook', url: 'https://www.facebook.com/YouthMixNGO' },
      {
        type: 'linkedin',
        url: 'https://www.linkedin.com/company/youth-mix-ngo/',
      },
    ],
    type: 'international',
    country: 'Armenia',
  },
] as PartnersInfo[];
