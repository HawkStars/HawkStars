import { InternationalizedArrayString } from "@/projects/sanity/sanity.types";

export const extractInternationalI18nString = ({ text, lng}: {
  text?: InternationalizedArrayString;
  lng: string;
}) => {
    const info = text?.find((item) => item._key == lng);
    return info?.value || ""
}