import Link from "next/link";
import Image from "next/image";
import Dropdown, { NavbarOption } from "./Dropdown";

const NGODropdownOptions = [
  { text: "Team", url: "/team" },
  { text: "Goals", url: "/" },
  { text: "Quem Somos", url: "/about" },
  { text: "Partners", url: "/" },
] as NavbarOption[];

const AtivitiesDropdownOptions = [
  { text: "Oportunidades", url: "/" },
  { text: "Eventos Passados", url: "/" },
  { text: "Voluntariado", url: "/" },
] as NavbarOption[];

const GlobalVillageOptions = [
  { text: "O Projecto", url: "/" },
  { text: "Missão e Valores", url: "/" },
  { text: "Objectivos", url: "/" },
] as NavbarOption[];

const Navbar = () => {
  return (
    <div className="navbar bg-orange-100 flex flex-col gap-3">
      <div className="flex justify-center mt-2">
        <Link href="/" className="normal-case text-xl">
          <div className="flex gap-1">
            <Image
              src="/logo.png"
              alt="Hawk Stars Logo"
              className="dark:invert"
              width={300}
              height={300}
              priority
            />
          </div>
        </Link>
      </div>
      <div>
        <ul className="menu menu-horizontal px-1">
          <li>
            <Dropdown title="NGO" options={NGODropdownOptions} />
          </li>
          <li>
            <Dropdown title="Ativities" options={AtivitiesDropdownOptions} />
          </li>
          <li>
            <Dropdown
              title="The Global Village"
              options={GlobalVillageOptions}
            />
          </li>
          <li>
            <p>Be a member</p>
          </li>
          <li>
            <p>Donate</p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
