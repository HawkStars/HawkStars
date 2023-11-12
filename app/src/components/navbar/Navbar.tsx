"use client";

import Link from "next/link";
import Image from "next/image";
import useTranslation from "next-translate/useTranslation";
import { RxHamburgerMenu } from "react-icons/rx";

import MenuItem from "../menu/MenuItem";

import { useSetMobileNavbarOpen } from "@/contexts/AppProvider";
import Button from "../utils/Button";
import { MenuSections } from "../footer/config";
import LanguageSwitcher from "../utils/LanguageSwitcher";
import { BE_MEMBER_FORM_URL, DONATE_URL } from "@/paths";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const { t } = useTranslation();
  const setMobileMenuOpen = useSetMobileNavbarOpen();
  const router = useRouter();

  return (
    <>
      <div className="bg-bege-dark px-4 lg:px-14">
        <div className="flex gap-3">
          <div className="my-auto flex justify-center py-3">
            <Link href="/" className="text-xl normal-case">
              <div className="flex gap-1">
                <Image
                  src="/logo.png"
                  alt="Hawk Stars Logo"
                  width={150}
                  height={100}
                  priority
                />
              </div>
            </Link>
          </div>
          {/* NAVBAR DESKTOP */}
          <div className="my-auto ml-auto hidden lg:block">
            <div className="ml-auto flex gap-3">
              <ul className="flex flex-row gap-8 px-1">
                {MenuSections.map((section, index) => {
                  const { title, options } = section;
                  return (
                    <li className="my-auto" key={index}>
                      <MenuItem title={title} options={options} />
                    </li>
                  );
                })}

                <li className="my-auto">
                  <Link
                    href={BE_MEMBER_FORM_URL}
                    target="_blank"
                    className="cursor-pointer"
                  >
                    {t("common.be_member")}
                  </Link>
                </li>
                <li>
                  <Button
                    type={"submit"}
                    onClick={() => {
                      router.push(DONATE_URL);
                    }}
                  >
                    {t("common.donate")}{" "}
                  </Button>
                </li>
              </ul>
              <div className="my-auto">
                <LanguageSwitcher />
              </div>
            </div>
          </div>
          {/* NAVBAR MOBILE */}
          <div className="my-auto ml-auto block cursor-pointer lg:hidden">
            <RxHamburgerMenu
              size={28}
              onClick={() => setMobileMenuOpen(true)}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
