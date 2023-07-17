"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { RxHamburgerMenu } from "react-icons/rx";

import MenuItem from "../menu/MenuItem";

import { AtivitiesDropdownOptions, NGODropdownOptions } from "./config";
import { useSetMobileNavbarOpen } from "@/contexts/AppProvider";
import Button from "../utils/Button";

const Navbar = () => {
  const t = useTranslations();
  const setMobileMenuOpen = useSetMobileNavbarOpen();

  return (
    <>
      <div className="bg-bege-dark px-2 lg:px-14">
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
                <li>
                  <MenuItem title="ONG" options={NGODropdownOptions} />
                </li>
                <li>
                  <MenuItem
                    title="Atividades"
                    options={AtivitiesDropdownOptions}
                  />
                </li>

                <li>
                  <p>Ser membro</p>
                </li>
                <li>
                  <Button type={"submit"}>Doar</Button>
                </li>
              </ul>
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
