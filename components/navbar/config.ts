import {
  ABOUT_US_URL,
  DONATE_URL,
  GLOBAL_VILLAGE_ARQUITECTURE,
  GLOBAL_VILLAGE_OBJECTIVES,
  GLOBAL_VILLAGE_URL,
  HAWK_HISTORY_URL,
  PARTNERS_URL,
  TEAM_URL,
  TRANSPARENCY_URL,
} from '../../utils/paths';
import { NavbarItem, NavbarUrlItem } from './types';

const NGODropdownOptions = [
  { label: 'navbar.about', url: ABOUT_US_URL },
  { label: 'navbar.team', url: TEAM_URL },
  { label: 'navbar.partners', url: PARTNERS_URL },
  { label: 'navbar.history', url: HAWK_HISTORY_URL, disabled: true },
] as NavbarUrlItem[];

const AtivitiesDropdownOptions = [
  { label: 'navbar.events', disabled: true },
  { label: 'navbar.past_events', disabled: true },
] as NavbarUrlItem[];

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
] as NavbarUrlItem[];

export const MenuSections = [
  {
    title: 'navbar.ngo',
    type: 'dropdown',
    options: NGODropdownOptions,
  },
  {
    title: 'navbar.ativities',
    type: 'dropdown',
    options: AtivitiesDropdownOptions,
  },
  {
    title: 'navbar.global_village.title',
    type: 'dropdown',
    options: GlobalVillageOptions,
  },
  {
    type: 'single',
    option: { label: 'navbar.art_gallery', url: '', disabled: true },
  },
  {
    type: 'single',
    option: { label: 'navbar.hawk_store', url: '', disabled: true },
  },
] as NavbarItem[];

export { NGODropdownOptions, AtivitiesDropdownOptions, GlobalVillageOptions };
