import { ABOUT_US_URL, DONATE_URL, PARTNERS_URL, TEAM_URL } from "@/app/paths";
import { NavbarOption } from "../menu/MenuItem";

const NGODropdownOptions = [
  { label: "Quem Somos", url: ABOUT_US_URL },
  { label: "Equipa", url: TEAM_URL },
  { label: "Visão", url: ABOUT_US_URL },
  { label: "Parceiros", url: PARTNERS_URL },
] as NavbarOption[];

const AtivitiesDropdownOptions = [
  { label: "Oportunidades", disabled: false },
  { label: "Voluntariado", disabled: false },
  { label: "Eventos", disabled: false },
  { label: "Projectos Decorridos", disabled: false },
] as NavbarOption[];

const GlobalVillageOptions = [
  { label: "Pinhel", disabled: false },
  { label: "O Projecto", disabled: false },
  { label: "Missão e Valores", disabled: false },
  { label: "Objectivos", disabled: false },
  { label: "Donate", url: DONATE_URL },
] as NavbarOption[];

export { NGODropdownOptions, AtivitiesDropdownOptions, GlobalVillageOptions };
