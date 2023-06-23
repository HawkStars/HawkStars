import React from "react";
import Socials from "../utils/Socials";
import Image from "next/image";
import Link from "next/link";
import { MenuSections } from "./config";

const Footer = () => {
  return (
    <footer>
      <div>
        <div className="grid grid-cols-1 gap-1 px-12 py-4 lg:grid-cols-5 lg:gap-5 lg:pt-20">
          <div className="my-auto flex lg:mx-auto lg:-mt-16">
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
                className="text-terciary-100 ml-0 py-5 text-left lg:ml-5 lg:text-left"
              >
                <h3 className="mb-3 text-lg font-bold">{section.title}</h3>
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
          <div className=""></div>
        </div>
        <div className="borber-t flex px-10 py-2">
          <p className="text-sm">
            Designed by{" "}
            <Link
              href={"http://rodrigorossellini.com/"}
              className="text-bege-dark"
            >
              @Rodrigo Rosselini
            </Link>
            . Built by{" "}
            <Link
              href={"https://www.linkedin.com/in/pcardosolei/"}
              className="text-bege-dark"
            >
              @Paulo Cardoso
            </Link>
          </p>
          <div className="ml-auto">
            <Socials />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
