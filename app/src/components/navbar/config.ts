import { ABOUT_US_URL, PARTNERS_URL, TEAM_URL } from "@/app/paths";
import { NavbarOption } from "@/models/navbar";

const NGODropdownOptions = [
  { label: "navbar.about", url: ABOUT_US_URL },
  { label: "navbar.team", url: TEAM_URL },
  { label: "navbar.partners", url: PARTNERS_URL },
] as NavbarOption[];

const AtivitiesDropdownOptions = [
  { label: "navbar.opportunities", disabled: true },
  { label: "navbar.volunteering", disabled: true },
  { label: "navbar.events", disabled: true },
  { label: "navbar.past_events", disabled: true },
] as NavbarOption[];

const GlobalVillageOptions = [
  { label: "navbar.global_village.pinhel", disabled: true },
  { label: "navbar.global_village.project", disabled: true },
  { label: "navbar.global_village.mission_values", disabled: true },
  { label: "navbar.global_village.objectives", disabled: true },
] as NavbarOption[];

export { NGODropdownOptions, AtivitiesDropdownOptions, GlobalVillageOptions };
