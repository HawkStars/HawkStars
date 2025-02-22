import { urls } from '@/utils/paths';
import { NavbarItem, NavbarUrlItem } from './types';

const {
  about,
  donate,
  erasmus,
  events,
  gallery,
  global_village_arquitecture,
  global_village_objectives,
  global_village,
  history,
  partners,
  pinhel,
  team,
  transparency,
  terms,
  artwork,
} = urls;

const SHOP_URL = 'https://shop.hawkstars.org';

const NGODropdownOptions = [
  { label: 'navbar.about', url: about },
  { label: 'navbar.team', url: team },
  { label: 'navbar.partners', url: partners },
  { label: 'navbar.history', url: history },
] as NavbarUrlItem[];

const AtivitiesDropdownOptions = [
  { label: 'navbar.events', url: events, disabled: true },
  { label: 'navbar.erasmus', url: erasmus, disabled: true },
] as NavbarUrlItem[];

const GlobalVillageOptions = [
  { label: 'navbar.global_village.project', url: global_village },
  { label: 'navbar.global_village.objectives', url: global_village_objectives },
  {
    label: 'navbar.global_village.arquitecture',
    url: global_village_arquitecture,
  },
  { label: 'navbar.global_village.contribute', url: donate },
  { label: 'navbar.global_village.transparency', url: transparency },
  { label: 'navbar.global_village.pinhel', url: pinhel },
] as NavbarUrlItem[];

const ArtGalleryOptions = [
  { label: 'navbar.art_gallery.presentation', url: gallery },
  { label: 'navbar.art_gallery.curation', url: gallery },
  { label: 'navbar.art_gallery.art', url: artwork },
] as NavbarUrlItem[];

export const MenuSections = [
  {
    title: 'navbar.ngo',
    type: 'dropdown',
    options: NGODropdownOptions,
  },
  // {
  //   title: 'navbar.ativities',
  //   type: 'dropdown',
  //   options: AtivitiesDropdownOptions,
  // },
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
