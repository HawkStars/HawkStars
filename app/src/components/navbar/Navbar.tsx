import Link from "next/link";
import Image from "next/image";
import Socials from "../utils/Socials";
import MenuItem, { NavbarOption } from "./MenuItem";

const NGODropdownOptions = [
  { text: "Quem Somos", url: "/about" },
  { text: "Team", url: "/team" },
  { text: "Visão", url: "/" },
  { text: "Parceiros", url: "/" },
] as NavbarOption[];

const AtivitiesDropdownOptions = [
  { text: "Oportunidades", url: "/", disabled: false },
  { text: "Voluntariado", url: "/", disabled: false },
  { text: "Eventos", url: "/", disabled: false },
  { text: "Projectos Decorridos", url: "/", disabled: false },
] as NavbarOption[];

const GlobalVillageOptions = [
  { text: "Pinhel", url: "/", disabled: false },
  { text: "O Projecto", url: "/", disabled: false },
  { text: "Missão e Valores", url: "/", disabled: false },
  { text: "Objectivos", url: "/", disabled: false },
  { text: "Donate", url: "/", disabled: false },
] as NavbarOption[];

const Navbar = () => {
  return (
    <div className="navbar flex gap-3 bg-orange-100 px-14">
      <div className="my-auto flex justify-center py-3">
        <Link href="/" className="text-xl normal-case">
          <div className="flex gap-1">
            <Image
              src="/logo.png"
              alt="Hawk Stars Logo"
              // className="dark:invert"
              width={150}
              height={100}
              priority
            />
          </div>
        </Link>
      </div>
      <div className="ml-auto">
        <ul className="menu menu-horizontal px-1">
          <li>
            <MenuItem title="ONG" options={NGODropdownOptions} />
          </li>
          <li>
            <MenuItem title="Atividades" options={AtivitiesDropdownOptions} />
          </li>
          {/* <li>
            <p>Gaming</p>
            {/* DROPDOWN COM - TEAM, logos, twitch, media 
          </li>
          <li>
            <p>Notícias</p>
          </li>
          <li>
            <p>Contactos</p>
          </li> */}
          {/* <li>
            <p>Ser membro</p>
          </li> */}
          {/* <li>
            <Button type={"submit"}>Doar</Button>
          </li> */}
        </ul>
        <div className="ml-5">
          <Socials />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
