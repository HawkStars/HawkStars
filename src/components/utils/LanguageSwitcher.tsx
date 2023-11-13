import { PT, GB } from "country-flag-icons/react/3x2";
import { useState } from "react";

import { PiCaretDownThin } from "react-icons/pi";
import classNames from "classnames";
import { usePathname } from "next/navigation";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";

type LanguageSwitcherProps = {
  closeMobileTabHandler?: () => void;
};

const LanguageSwitcher = ({ closeMobileTabHandler }: LanguageSwitcherProps) => {
  const [showLanguageOptions, setShowLanguageOptions] =
    useState<boolean>(false);
  const pathname = usePathname();
  const { lang } = useTranslation();

  const closeMobileTab = () => {
    closeMobileTabHandler && closeMobileTabHandler();
    setShowLanguageOptions(false);
  };

  return (
    <>
      <div
        className="relative flex cursor-pointer flex-row gap-2 px-3"
        onClick={() =>
          setShowLanguageOptions((currentStatus) => !currentStatus)
        }
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
      {showLanguageOptions && (
        <div className="z-100 absolute mt-2 flex w-fit cursor-pointer flex-col gap-2 bg-white py-1 pl-3 pr-5">
          {lang !== "en" && (
            <Link
              className="flew-row flex gap-2"
              href={`${pathname}/?lang=en`}
              onClick={() => closeMobileTab()}
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
            </Link>
          )}
          {lang !== "pt" && (
            <Link
              href={`${pathname}/?lang=pt`}
              className="flew-row flex gap-2"
              onClick={() => closeMobileTab()}
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
            </Link>
          )}
        </div>
      )}
    </>
  );
};

export default LanguageSwitcher;
