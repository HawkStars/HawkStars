import React from "react";
import Socials from "../utils/Socials";
import Image from "next/image";
import Link from "next/link";
import { MenuSections } from "./config";
import Button from "../utils/Button";

const Footer = () => {
  return (
    <footer>
      <div className="grid grid-cols-1 gap-1 px-12 py-4 lg:grid-cols-5 lg:gap-7 lg:pt-20">
        <div className="my-auto lg:mx-auto">
          <Image
            src="/logo.png"
            alt="hawkstars"
            height="200"
            width="200"
          ></Image>
        </div>
        {MenuSections.map((section, index) => {
          const { title, options } = section;
          return (
            <div
              key={index}
              className="text-terciary-100 ml-0 text-left lg:text-left"
            >
              <h3 className="mb-3 text-lg font-bold">{title}</h3>
              {options.map((option, index) => (
                <div className="py-1" key={index}>
                  <Link href={option.url} className="fs-300 clr-white">
                    {option.label}
                  </Link>
                </div>
              ))}
            </div>
          );
        })}
        <div className="flex flex-col">
          <Link href={"/"}>Sê um membro</Link>
          <Button type={"button"} variant="success">
            Doações
          </Button>
        </div>
      </div>
      <div className="borber-t flex px-10 pb-10">
        <p className="text-sm">
          Designed by{" "}
          <Link href={"http://rodrigorossellini.com/"} className="underline">
            @Rodrigo Rosselini
          </Link>
          . Built by{" "}
          <Link
            href={"https://www.linkedin.com/in/pcardosolei/"}
            className="underline"
          >
            @Paulo Cardoso
          </Link>
        </p>
        <div className="ml-auto">
          <Socials />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
