"use client";
import { PT, GB } from "country-flag-icons/react/3x2";
import { useState } from "react";

import { PiCaretDownThin } from "react-icons/pi";
import classNames from "classnames";
import { usePathname, useRouter } from "next/navigation";
import useTranslation from "next-translate/useTranslation";

const LanguageSwitcher = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { lang } = useTranslation();
  const [toggleOptionSelection, setToggleOptionSelection] =
    useState<boolean>(false);

  return (
    <>
      <div
        className="relative flex cursor-pointer flex-row gap-2 px-3"
        onClick={() => setToggleOptionSelection(!toggleOptionSelection)}
      >
        {lang === "pt" ? (
          <>
            <div className="flex h-4 w-6">
              <PT title="PT" />
            </div>
            <label className="my-auto text-xs">PT</label>
          </>
        ) : (
          <>
            <div className="flex h-4 w-6">
              <GB title="EN" />
            </div>
            <label className="my-auto text-xs">EN</label>
          </>
        )}
        <PiCaretDownThin />
      </div>
      {toggleOptionSelection && (
        <div className="z-100 absolute mt-2 flex w-fit cursor-pointer flex-col gap-2 bg-white py-1 pl-3 pr-5">
          {lang !== "en" && (
            <div
              onClick={() => router.replace(`en/${pathname}`)}
              className="flew-row flex gap-2"
            >
              <div className="flex h-4 w-6 cursor-pointer">
                <GB title="EN" />
              </div>
              <label
                className={classNames("my-auto text-xs", {
                  "text-bege-light": lang == "en",
                })}
              >
                EN
              </label>
            </div>
          )}
          {lang !== "pt" && (
            <div
              onClick={() => router.replace(`pt/${pathname}`)}
              className="flew-row flex gap-2"
            >
              <div className="flex h-4 w-6 cursor-pointer">
                <PT title="PT" />
              </div>
              <label
                className={classNames("my-auto text-xs", {
                  "text-bege-dark": lang == "pt",
                })}
              >
                PT
              </label>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default LanguageSwitcher;
