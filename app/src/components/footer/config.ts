import {
  AtivitiesDropdownOptions,
  GlobalVillageOptions,
  NGODropdownOptions,
} from "../navbar/config";

export const MenuSections = [
  {
    title: "NGO",
    options: NGODropdownOptions,
  },
  {
    title: "Atividades",
    options: AtivitiesDropdownOptions,
  },
  {
    title: "The Global Village",
    options: GlobalVillageOptions,
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
