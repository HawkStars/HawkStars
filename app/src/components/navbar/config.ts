import { ABOUT_US_URL, PARTNERS_URL, TEAM_URL } from "@/app/paths";
import { NavbarOption } from "@/models/navbar";

const NGODropdownOptions = [
  { label: "Quem Somos", url: ABOUT_US_URL },
  { label: "Equipa", url: TEAM_URL },
  { label: "Parceiros", url: PARTNERS_URL },
] as NavbarOption[];

const AtivitiesDropdownOptions = [
  { label: "Oportunidades", disabled: true },
  { label: "Voluntariado", disabled: true },
  { label: "Eventos", disabled: true },
  { label: "Projectos Decorridos", disabled: true },
] as NavbarOption[];

const GlobalVillageOptions = [
  { label: "Pinhel", disabled: true },
  { label: "O Projecto", disabled: true },
  { label: "Missão e Valores", disabled: true },
  { label: "Objectivos", disabled: true },
] as NavbarOption[];

export { NGODropdownOptions, AtivitiesDropdownOptions, GlobalVillageOptions };
