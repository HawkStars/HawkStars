export const boardSections = ['geral', 'fiscal', 'board'] as const;
export type OrgSectionTuple = typeof boardSections;
export type OrgSection = OrgSectionTuple[number];

export const sectionLabels = {
  geral: 'geral',
  fiscal: 'fiscal',
  board: 'board',
};

export const TeamMembers = {
  geral: [
    {
      name: 'José Amaral Lopes',
      position: 'roles.president',
      photo: '/images/team/jose_amaral.jpg',
      url: undefined,
    },
    {
      name: 'Miguel Ferreira da Silva',
      position: 'roles.vice_president',
      photo: '/images/team/miguel_ferreira.jpg',
      url: 'https://www.linkedin.com/in/miguel-ferreira-da-silva-pt',
    },
    {
      name: 'Fátima Duarte Amaro',
      position: 'roles.f_secretary',
      photo: '/images/team/fatima_amaro.jpg',
      url: 'https://www.linkedin.com/in/fatimaduarteamaro',
    },
    {
      name: 'Carlos Bruno',
      position: 'roles.substitute',
      photo: '/images/team/carlos_bruno.jpg',
      url: 'https://www.linkedin.com/in/carlos-bruno-1964b5138',
    },
  ],
  fiscal: [
    {
      name: 'José Tomaz',
      position: 'roles.president',
      photo: '/images/team/jose_tomaz.jpg',
      url: 'https://www.linkedin.com/in/jose-fernando-tomaz-63951529',
    },
    {
      name: 'Fábio Pinto',
      position: 'roles.rapporteur_secretary',
      photo: '/images/team/fabio_pinto.png',
      url: 'https://www.linkedin.com/in/fabiofpinto',
    },
    {
      name: 'Carlos Guimarães',
      position: 'roles.vogal',
      photo: '/images/team/carlos_guimaraes.png',
      url: undefined,
    },
    {
      name: 'João Almeida',
      position: 'roles.substitute',
      photo: '/images/team/joao_almeida.jpg',
      url: 'https://www.linkedin.com/in/jo%C3%A3o-almeida-759a97264',
    },
    {
      name: 'Sandra Ladeiro',
      position: 'roles.substitute',
      photo: '/images/team/sandra_ladeiro.jpg',
      url: 'https://www.linkedin.com/in/sandra-pereira-ladeiro-27722b58',
    },
  ],
  board: [
    {
      name: 'Ângelo Videira dos Santos',
      position: 'roles.president',
      photo: '/images/team/angelo_videira.jpg',
      url: 'https://www.linkedin.com/in/angelovideiradosantos',
    },
    {
      name: 'David Almeida Silva',
      position: 'roles.vice_president',
      photo: '/images/team/david_almeida.jpg',
      url: 'https://www.linkedin.com/in/david-a-29a571197',
    },
    {
      name: 'Marco Jerónimo Madeira',
      position: 'roles.vice_president',
      photo: '/images/team/marco_jeronimo.png',
      url: undefined,
    },
    {
      name: 'Paulo Videira',
      position: 'roles.treasurer',
      photo: '/images/team/paulo_videira.jpg',
      url: '',
    },
    {
      name: 'José Bastos Pinto',
      position: 'roles.m_secretary',
      photo: '/images/team/jose_pinto_bastos.jpg',
      url: 'https://www.linkedin.com/in/jos%C3%A9-bastos-pinto-b64099116',
    },
    {
      name: 'Paulo Cardoso',
      position: 'roles.vogal',
      photo: '/images/team/paulo_cardoso.jpg',
      url: 'https://www.linkedin.com/in/pcardosolei',
    },
    {
      name: 'Manuel Ladeiro',
      position: 'roles.vogal',
      photo: undefined,
      url: 'https://www.linkedin.com/in/merckmoon-team-7975a6210',
    },
    {
      name: 'Manuel Matos dos Santos',
      position: 'roles.substitute',

      photo: '/images/team/manuel_matos.jpg',
      url: 'https://www.linkedin.com/in/manuel-matos-dos-santos',
    },
    {
      name: 'Luís Claro Marques',
      position: 'roles.substitute',
      photo: '/images/team/luis_claro.jpg',
      url: 'https://www.linkedin.com/in/lu%C3%ADs-filipe-marques-629136135',
    },
  ],
} as { [x: string]: TeamInfo[] };

type TeamInfo = {
  name: string;
  position: string;
  photo: string;
  url?: string;
};
