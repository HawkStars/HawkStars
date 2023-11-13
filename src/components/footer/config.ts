import { NavbarOption } from '@/models/navbar';
import {
  AtivitiesDropdownOptions,
  GlobalVillageOptions,
  NGODropdownOptions,
} from '../navbar/config';

export const MenuSections = [
  {
    title: 'navbar.ngo',
    options: NGODropdownOptions,
  },
  {
    title: 'navbar.ativities',
    options: AtivitiesDropdownOptions,
  },
  {
    title: 'navbar.global_village.title',
    options: GlobalVillageOptions,
  },
  // { title: 'navbar.art_gallery' },
] as MenuSection[];

type MenuSection = {
  title: string;
  options: NavbarOption[];
};
