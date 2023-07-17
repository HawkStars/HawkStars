export const boardSections = ["geral", "fiscal", "board"] as const;
export type OrgSectionTuple = typeof boardSections;
export type OrgSection = OrgSectionTuple[number];

export const sectionLabels = {
  geral: "team.geral",
  fiscal: "team.fiscal",
  board: "team.board",
};

export const TeamMembers = {
  geral: [
    {
      name: "José Amaral Lopes",
      position: "team.roles.president",
      photo: "/team/jose_amaral.jpg",
      url: undefined,
    },
    {
      name: "Miguel Ferreira da Silva",
      position: "team.roles.vice_president",
      photo: "/team/miguel_ferreira.jpg",
      url: "https://www.linkedin.com/in/miguel-ferreira-da-silva-pt",
    },
    {
      name: "Fátima Duarte Amaro",
      position: "team.roles.f_secretary",
      photo: "/team/fatima_amaro.jpg",
      url: "https://www.linkedin.com/in/fatimaduarteamaro",
    },
    {
      name: "António Campos",
      position: "team.roles.substitute",
      photo: "/team/rui_campos.jpg",
      url: "https://www.linkedin.com/in/rui-campos-fotografia",
    },
    {
      name: "Carlos Bruno",
      position: "team.roles.substitute",
      photo: "/team/carlos_bruno.jpg",
      url: "https://www.linkedin.com/in/carlos-bruno-1964b5138",
    },
  ],
  fiscal: [
    {
      name: "José Tomaz",
      position: "team.roles.president",
      photo: "/team/jose_tomaz.jpg",
      url: "https://www.linkedin.com/in/jose-fernando-tomaz-63951529",
    },
    {
      name: "Fábio Pinto",
      position: "team.roles.rapporteur_secretary",
      photo: "/team/fabio_pinto.png",
      url: "https://www.linkedin.com/in/fabiofpinto",
    },
    {
      name: "Carlos Guimarães",
      position: "team.roles.vogal",
      photo: "/team/carlos_guimaraes.png",
      url: undefined,
    },
    {
      name: "João Almeida",
      position: "team.roles.substitute",
      photo: "/team/joao_almeida.jpg",
      url: "https://www.linkedin.com/in/jo%C3%A3o-almeida-759a97264",
    },
    {
      name: "Sandra Ladeiro",
      position: "team.roles.substitute",
      photo: "/team/sandra_ladeiro.jpg",
      url: "https://www.linkedin.com/in/sandra-pereira-ladeiro-27722b58",
    },
  ],
  board: [
    {
      name: "Ângelo Videira dos Santos",
      position: "team.roles.president",
      photo: "/team/angelo_videira.jpg",
      url: "https://www.linkedin.com/in/angelovideiradosantos",
    },
    {
      name: "David Almeida Silva",
      position: "team.roles.vice_president",
      photo: "/team/david_almeida.jpg",
      url: undefined,
    },
    {
      name: "Marco Jerónimo Madeira",
      position: "team.roles.vice_president",
      photo: "/team/marco_jeronimo.png",
      url: undefined,
    },
    {
      name: "Paulo Videira",
      position: "team.roles.treasurer",
      photo: "/team/paulo_videira.jpg",
      url: "",
    },
    {
      name: "José Bastos Pinto",
      position: "team.roles.m_secretary",
      photo: "/team/jose_pinto_bastos.jpg",
      url: "https://www.linkedin.com/in/jos%C3%A9-bastos-pinto-b64099116",
    },
    {
      name: "Paulo Cardoso",
      position: "team.roles.vogal",
      photo: "/team/paulo_cardoso.jpg",
      url: "https://www.linkedin.com/in/pcardosolei",
    },
    {
      name: "Manuel Ladeiro",
      position: "team.roles.vogal",
      photo: undefined,
      url: "https://www.linkedin.com/in/merckmoon-team-7975a6210",
    },
    {
      name: "Manuel Matos dos Santos",
      position: "team.roles.substitute",

      photo: "/team/manuel_matos.jpg",
      url: "https://www.linkedin.com/in/manuel-matos-dos-santos",
    },
    {
      name: "Luís Claro Marques",
      position: "team.roles.substitute",
      photo: "/team/luis_claro.jpg",
      url: "https://www.linkedin.com/in/lu%C3%ADs-filipe-marques-629136135",
    },
  ],
} as { [x: string]: TeamInfo[] };

type TeamInfo = {
  name: string;
  position: string;
  photo: string;
  url?: string;
};
