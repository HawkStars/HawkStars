"use client";
import useTranslation from "next-translate/useTranslation";

import Accordion from "@/components/accordion/Accordion";

const GlobalVillageObjectives = () => {
  const { t, lang } = useTranslation("globalVillagePage");

  // const objetives: any = t("objetives.items", {}, { returnObjects: true });
  return (
    <div className="flex flex-col gap-3">
      <h1>{t("objetives.title")}</h1>
      {/* {objetives.map((objective) => (
        <Accordion key={objective.} title={""}></Accordion>
      ))} */}
    </div>
  );
};

export default GlobalVillageObjectives;
