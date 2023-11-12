"use client";

import Accordion from "@/components/accordion/Accordion";
import { useTranslations } from "next-intl";

const GlobalVillageObjectives = () => {
  const t = useTranslations("globalVillagePage");

  const objetives = t("objetives.items", { returnObjects: true });
  return (
    <div className="flex flex-col gap-3">
      <h1>{t("objetives.title")}</h1>
      {objetives.map}
      <Accordion title={""}></Accordion>
      <Accordion title={""}></Accordion>
      <Accordion title={""}></Accordion>
      <Accordion title={""}></Accordion>
      <Accordion title={""}></Accordion>
      <Accordion title={""}></Accordion>
      <Accordion title={""}></Accordion>
      <Accordion title={""}></Accordion>
    </div>
  );
};

export default GlobalVillageObjectives;
