import {
  ABOUT_US_URL,
  DONATE_URL,
  ERASMUS_PLUS_URL,
  EVENTS_URL,
  GALLERY_URL,
  GLOBAL_VILLAGE_ARQUITECTURE,
  GLOBAL_VILLAGE_OBJECTIVES,
  GLOBAL_VILLAGE_URL,
  HAWK_HISTORY_URL,
  PARTNERS_URL,
  PINHEL_URL,
  TEAM_URL,
  TRANSPARENCY_URL,
} from '../../utils/paths';
import { NavbarItem, NavbarUrlItem } from './types';

const SHOP_URL = 'https://shop.hawkstars.org';

const NGODropdownOptions = [
  { label: 'navbar.about', url: ABOUT_US_URL },
  { label: 'navbar.team', url: TEAM_URL },
  { label: 'navbar.partners', url: PARTNERS_URL },
  { label: 'navbar.history', url: HAWK_HISTORY_URL },
] as NavbarUrlItem[];

const AtivitiesDropdownOptions = [
  { label: 'navbar.events', url: EVENTS_URL, disabled: true },
  { label: 'navbar.erasmus', url: ERASMUS_PLUS_URL, disabled: true },
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
  { label: 'navbar.global_village.pinhel', url: PINHEL_URL },
] as NavbarUrlItem[];

const ArtGalleryOptions = [
  { label: 'navbar.art_gallery.presentation', url: GALLERY_URL },
  { label: 'navbar.art_gallery.curation', url: GALLERY_URL },
  { label: 'navbar.art_gallery.art', url: GALLERY_URL },
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
    title: 'navbar.art_gallery.title',
    type: 'dropdown',
    options: ArtGalleryOptions,
  },
  {
    type: 'single',
    option: { label: 'navbar.hawk_store', url: SHOP_URL },
  },
] as NavbarItem[];

export { NGODropdownOptions, AtivitiesDropdownOptions, GlobalVillageOptions };
