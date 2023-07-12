import { NavbarOption } from "@/models/navbar";
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

type MenuSection = {
  title: string;
  options: NavbarOption[];
};
