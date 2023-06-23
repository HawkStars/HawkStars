export const MenuSections = [
  {
    title: "NGO",
    options: [
      {
        label: "Quem Somos",
        url: "",
      },
      {
        label: "Team",
        url: "",
      },
      {
        label: "Visão",
        url: "",
      },
      {
        label: "Parceiros",
        url: "",
      },
    ],
  },
  {
    title: "Activities",
    options: [
      {
        label: "Voluntariado",
        url: "",
      },
      {
        label: "Oportunidades",
        url: "",
      },
      {
        label: "Eventos",
        url: "",
      },
    ],
  },
  {
    title: "The Global Village",
    options: [
      {
        label: "Pinhel",
        url: "",
      },
      {
        label: "O Projecto",
        url: "",
      },
      {
        label: "Missão e Valores",
        url: "",
      },
      {
        label: "Objectivos",
        url: "",
      },
      {
        label: "Donate",
        url: "",
      },
    ],
  },
] as MenuSection[];

type MenuUrl = {
  label: string;
  url: string;
};

type MenuSection = {
  title: string;
  options: MenuUrl[];
};
