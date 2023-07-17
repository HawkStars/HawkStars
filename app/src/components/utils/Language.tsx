"use client";
import { PT, GB } from "country-flag-icons/react/3x2";
import { useState } from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next-intl/client";

import { PiCaretDownThin } from "react-icons/pi";
import classNames from "classnames";

const LanguageSwitcher = () => {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const [toggleOptionSelection, setToggleOptionSelection] =
    useState<boolean>(false);

  return (
    <>
      <div
        className="relative flex cursor-pointer flex-row gap-2 px-3"
        onClick={() => setToggleOptionSelection(!toggleOptionSelection)}
      >
        {locale === "pt" ? (
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
          {locale !== "en" && (
            <div
              onClick={() => router.replace(pathname, { locale: "en" })}
              className="flew-row flex gap-2"
            >
              <div className="flex h-4 w-6">
                <GB title="EN" />
              </div>
              <label
                className={classNames("my-auto text-xs", {
                  "text-bege-light": locale == "en",
                })}
              >
                EN
              </label>
            </div>
          )}
          {locale !== "pt" && (
            <div
              onClick={() => router.replace(pathname, { locale: "pt" })}
              className="flew-row flex gap-2"
            >
              <div className="flex h-4 w-6">
                <PT title="PT" />
              </div>
              <label
                className={classNames("my-auto text-xs", {
                  "text-bege-dark": locale == "pt",
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
