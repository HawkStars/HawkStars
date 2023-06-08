import Link from "next/link";
import Image from "next/image";
import Dropdown, { NavbarOption } from "./Dropdown";

const NGODropdownOptions = [
  { text: "Quem Somos", url: "/about" },
  { text: "Team", url: "/team" },
  { text: "Visão", url: "/" },
  { text: "Parceiros", url: "/" },
] as NavbarOption[];

const AtivitiesDropdownOptions = [
  { text: "Oportunidades", url: "/" },
  { text: "Voluntariado", url: "/" },
  { text: "Eventos", url: "/" },
  { text: "Projectos Decorridos", url: "/" },
] as NavbarOption[];

const GlobalVillageOptions = [
  { text: "Pinhel", url: "/" },
  { text: "O Projecto", url: "/" },
  { text: "Missão e Valores", url: "/" },
  { text: "Objectivos", url: "/" },
  { text: "Donate", url: "/" },
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
            <Dropdown title="ONG" options={NGODropdownOptions} />
          </li>
          <li>
            <Dropdown title="Atividades" options={AtivitiesDropdownOptions} />
          </li>
          <li>
            <Dropdown
              title="The Global Village"
              options={GlobalVillageOptions}
            />
          </li>
          <li>
            <p>Gaming</p>
            {/* DROPDOWN COM - TEAM, logos, twitch, media */}
          </li>
          <li>
            <p>Notícias</p>
          </li>
          <li>
            <p>Contactos</p>
          </li>
          <li>
            <p>Ser membro</p>
          </li>
          <li>
            <p>Doar</p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
