import { NavbarOption } from "../menu/MenuItem";

const NGODropdownOptions = [
  { text: "Quem Somos", url: "/about" },
  { text: "Equipa", url: "/team" },
  { text: "Visão" },
  { text: "Parceiros" },
] as NavbarOption[];

const AtivitiesDropdownOptions = [
  { text: "Oportunidades", disabled: false },
  { text: "Voluntariado", disabled: false },
  { text: "Eventos", disabled: false },
  { text: "Projectos Decorridos", disabled: false },
] as NavbarOption[];

const GlobalVillageOptions = [
  { text: "Pinhel", disabled: false },
  { text: "O Projecto", disabled: false },
  { text: "Missão e Valores", disabled: false },
  { text: "Objectivos", disabled: false },
  { text: "Donate", disabled: false },
] as NavbarOption[];

export { NGODropdownOptions, AtivitiesDropdownOptions, GlobalVillageOptions };
