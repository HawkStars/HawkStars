import {
  ABOUT_US_URL,
  DONATE_URL,
  GLOBAL_VILLAGE_ARQUITECTURE,
  GLOBAL_VILLAGE_OBJECTIVES,
  GLOBAL_VILLAGE_URL,
  PARTNERS_URL,
  TEAM_URL,
  TRANSPARENCY_URL,
} from '../../utils/paths';
import { NavbarOption } from '../../models/navbar';

const NGODropdownOptions = [
  { label: 'navbar.about', url: ABOUT_US_URL },
  { label: 'navbar.team', url: TEAM_URL },
  { label: 'navbar.partners', url: PARTNERS_URL },
] as NavbarOption[];

const AtivitiesDropdownOptions = [
  { label: 'navbar.events', disabled: true },
  { label: 'navbar.past_events', disabled: true },
] as NavbarOption[];

const GlobalVillageOptions = [
  { label: 'navbar.global_village.project', url: GLOBAL_VILLAGE_URL },
  { label: 'navbar.global_village.objectives', url: GLOBAL_VILLAGE_OBJECTIVES },
  {
    label: 'navbar.global_village.arquitecture',
    url: GLOBAL_VILLAGE_ARQUITECTURE,
  },
  { label: 'navbar.global_village.contribute', url: DONATE_URL },
  { label: 'navbar.global_village.transparency', url: TRANSPARENCY_URL },
  { label: 'navbar.global_village.pinhel', disabled: true },
] as NavbarOption[];

export { NGODropdownOptions, AtivitiesDropdownOptions, GlobalVillageOptions };
