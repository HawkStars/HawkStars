"use client";

import Image from "next/image";
import Button from "@/components/utils/Button";
import { useTranslations } from "next-intl";

import config from "./config.json";

const HomeComponent = () => {
  const t = useTranslations();
  return (
    <>
      <section className="flex flex-col bg-bege-light px-8 pb-5 pt-10 lg:px-14 lg:pb-10 lg:pl-20 lg:pt-40">
        <div className="flex flex-col gap-1 lg:flex-row">
          <div className="flex flex-col gap-2 lg:w-1/2">
            <h4 className="text-4xl font-black">{t("home.title")}</h4>
            <p className="text-justify">{t("home.description")}</p>
            <div className="mt-8 flex gap-5">
              <div className="w-fit">
                <Button disabled={true} type={"button"}>
                  {t("common.donate")}
                </Button>
              </div>
              <div className="w-fit">
                <Button outline={true} type={"button"}>
                  {t("common.be_member")}
                </Button>
              </div>
            </div>
          </div>
          <div className="relative mt-2 h-96 w-full py-20 lg:mt-0 lg:w-1/2 lg:py-0">
            <Image
              src="/frontpage/hero.png"
              fill={true}
              style={{ objectFit: "contain" }}
              alt="Main Image Index"
            />
          </div>
        </div>
      </section>
      <section>
        <div className="mt-5 flex flex-col gap-10 px-8 pb-10 lg:mt-20 lg:flex-row-reverse lg:px-14 lg:pl-20">
          <div className="flex flex-col gap-2 lg:w-1/2">
            <h4 className="text-2xl font-black text-green">
              {t("home.about")}
            </h4>
            <h4 className="text-xl font-black">{t("home.objetives_title")}</h4>
            <p className="text-justify">{t("home.objetives_body")}</p>
          </div>
          <div className="relative h-96 w-full lg:w-1/2">
            <Image
              src="/frontpage/quem_somos.png"
              alt="quem_somos"
              fill={true}
              style={{ objectFit: "cover" }}
            />
          </div>
        </div>
      </section>
      <section className="px-2 py-10">
        <h4 className="flex justify-center text-2xl font-black text-green">
          {t("home.values_title")}
        </h4>
        <h6 className="flex justify-center text-center">
          {t("home.values_body")}
        </h6>
        <div className="mx-auto mt-10 grid w-2/3 grid-cols-1 gap-3 lg:grid-cols-3">
          {config.vision.map((option, index) => (
            <div key={index} className="flex flex-col items-center gap-2">
              <div>
                <Image
                  src={option.icon}
                  alt={`${option.title} icon`}
                  width={32}
                  height={32}
                />
              </div>
              <h5 className="font-black text-green">{t(option.title)}</h5>
              <h6 className="text-center">{t(option.description)}</h6>
            </div>
          ))}
        </div>
      </section>
      <section className="h-96 bg-bege-dark py-10"></section>
    </>
  );
};
export default HomeComponent;
