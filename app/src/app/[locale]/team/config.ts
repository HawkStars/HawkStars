export const boardSections = ["geral", "fiscal", "board"] as const;
export type OrgSectionTuple = typeof boardSections;
export type OrgSection = OrgSectionTuple[number];

export const sectionLabels = {
  geral: "Assembleia Geral",
  fiscal: "Conselho Fiscal",
  board: "Direção",
};

export const TeamMembers = {
  geral: [
    {
      name: "José Amaral Lopes",
      position: "Presidente",
      photo: "/team/jose_amaral.jpg",
      url: undefined,
    },
    {
      name: "Miguel Ferreira da Silva",
      position: "Vice-Presidente",
      photo: "/team/miguel_ferreira.jpg",
      url: "https://www.linkedin.com/in/miguel-ferreira-da-silva-pt",
    },
    {
      name: "Fátima Duarte Amaro",
      position: "Secretária",
      photo: "/team/fatima_amaro.jpg",
      url: "https://www.linkedin.com/in/fatimaduarteamaro",
    },
    {
      name: "António Campos",
      position: "Suplente",
      photo: "/team/rui_campos.jpg",
      url: "https://www.linkedin.com/in/rui-campos-fotografia",
    },
    {
      name: "Carlos Bruno",
      position: "Suplente",
      photo: "/team/carlos_bruno.jpg",
      url: "https://www.linkedin.com/in/carlos-bruno-1964b5138",
    },
  ],
  fiscal: [
    {
      name: "José Tomaz",
      position: "Presidente",
      photo: "/team/jose_tomaz.jpg",
      url: "https://www.linkedin.com/in/jose-fernando-tomaz-63951529",
    },
    {
      name: "Fábio Pinto",
      position: "Secretário Relator",
      photo: "/team/fabio_pinto.png",
      url: "https://www.linkedin.com/in/fabiofpinto",
    },
    {
      name: "Carlos Guimarães",
      position: "Vogal",
      photo: "/team/carlos_guimaraes.png",
      url: undefined,
    },
    {
      name: "João Almeida",
      position: "Suplente",
      photo: "/team/joao_almeida.jpg",
      url: "https://www.linkedin.com/in/jo%C3%A3o-almeida-759a97264",
    },
    {
      name: "Sandra Ladeiro",
      position: "Suplente",
      photo: "/team/sandra_ladeiro.jpg",
      url: "https://www.linkedin.com/in/sandra-pereira-ladeiro-27722b58",
    },
  ],
  board: [
    {
      name: "Ângelo Videira dos Santos",
      position: "Presidente",
      photo: "/team/angelo_videira.jpg",
      url: "https://www.linkedin.com/in/angelovideiradosantos",
    },
    {
      name: "David Almeida Silva",
      position: "Vice-Presidente",
      photo: "/team/david_almeida.jpg",
      url: undefined,
    },
    {
      name: "Marco Jerónimo Madeira",
      position: "Vice-Presidente",
      photo: "/team/marco_jeronimo.png",
      url: undefined,
    },
    {
      name: "Paulo Videira",
      position: "Tesoureiro",
      photo: "/team/paulo_videira.jpg",
      url: "",
    },
    {
      name: "José Bastos Pinto",
      position: "Secretário",
      photo: "/team/jose_pinto_bastos.jpg",
      url: "https://www.linkedin.com/in/jos%C3%A9-bastos-pinto-b64099116",
    },
    {
      name: "Paulo Cardoso",
      position: "Vogal",
      photo: "/team/paulo_cardoso.jpg",
      url: "https://www.linkedin.com/in/pcardosolei",
    },
    {
      name: "Manuel Ladeiro",
      position: "Vogal",
      photo: undefined,
      url: "https://www.linkedin.com/in/merckmoon-team-7975a6210",
    },
    {
      name: "Manuel Matos dos Santos",
      position: "Suplente",

      photo: "/team/manuel_matos.jpg",
      url: "https://www.linkedin.com/in/manuel-matos-dos-santos",
    },
    {
      name: "Luís Claro Marques",
      position: "Suplente",
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
