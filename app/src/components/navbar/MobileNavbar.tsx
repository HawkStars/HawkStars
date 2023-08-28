"use client";

import {
  useMainAppContext,
  useSetMobileNavbarOpen,
} from "@/contexts/AppProvider";
import Image from "next/image";
import Link from "next/link";
import { RxCross1 } from "react-icons/rx";
import { useTranslations } from "next-intl";
import MobileMenuItem from "../menu/MobileMenuItem";
import Button from "../utils/Button";
import Socials from "../utils/Socials";
import { NGODropdownOptions } from "./config";
import LanguageSwitcher from "../utils/Language";
import { BE_MEMBER_FORM_URL } from "@/app/paths";

const MobileNavbar = () => {
  const t = useTranslations();
  const { mobileNavbarOpen } = useMainAppContext();
  const setMobileMenuOpen = useSetMobileNavbarOpen();

  return (
    <>
      {mobileNavbarOpen && (
        <div className="fixed z-900 flex h-screen w-full flex-col gap-4 bg-white px-4 py-3 lg:hidden">
          <div className="flex">
            <Image
              src="/logo.png"
              alt="Hawk Stars Logo"
              width={150}
              height={100}
              priority
            />
            <div className="my-auto ml-auto block cursor-pointer lg:hidden">
              <RxCross1 size={28} onClick={() => setMobileMenuOpen(false)} />
            </div>
          </div>
          <div className="-ml-3">
            <LanguageSwitcher />
          </div>
          <div>
            <Socials />
          </div>
          <div className="mt-5 flex flex-col gap-3">
            <MobileMenuItem
              title={t("navbar.ngo")}
              options={NGODropdownOptions}
            />
          </div>
          <div>
            <div className="flex flex-col">
              <Link
                href={BE_MEMBER_FORM_URL}
                target="_blank"
                className="mb-2 cursor-pointer text-lg font-black"
              >
                {t("common.be_member")}
              </Link>
              <Button type={"button"} variant="success" size="full">
                {t("common.donate")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileNavbar;
