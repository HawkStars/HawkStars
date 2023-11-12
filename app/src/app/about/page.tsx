import { Metadata } from "next";
import { defaultMetadata } from "@/app/metadata";
import AboutPage from "@/components/about/AboutPage";

export const metadata = {
  title: "Hawk Stars - About Us",
  description:
    "Hawk Stars objetives and values and main goals for the next years for the international community and local ativities",
  ...defaultMetadata,
} as Metadata;

const Index = () => {
  return <AboutPage />;
};

export default Index;
