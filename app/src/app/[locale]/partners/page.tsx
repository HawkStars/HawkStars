import PartnersComponent from "@/components/partners/PartnersComponent";
import { Metadata } from "next";

export const metadata = {
  title: "Hawk Stars - Partners",
  description: "Partners that work directly with Hawk Stars NGO",
} as Metadata;

const PartnersPage = () => {
  return <PartnersComponent />;
};

export default PartnersPage;
