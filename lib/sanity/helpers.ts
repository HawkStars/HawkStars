import { InternationalizedArrayString } from "@/projects/sanity/sanity.types";

export const extractInternationalI18nString = ({block, lng}: {
  block?: InternationalizedArrayString;
  lng: string;
}) => {
    const info = block?.find((item) => item._key == lng);
    return info?.value || ""
}