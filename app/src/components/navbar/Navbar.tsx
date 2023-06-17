import Link from "next/link";
import Image from "next/image";
import Socials from "../utils/Socials";
import MenuItem, { NavbarOption } from "./MenuItem";

const NGODropdownOptions = [
  { text: "Quem Somos", url: "/about" },
  { text: "Team" },
  { text: "Visão" },
  { text: "Parceiros" },
] as NavbarOption[];

const AtivitiesDropdownOptions = [
  { text: "Oportunidades", disabled: false },
  { text: "Voluntariado", disabled: false },
  { text: "Eventos", disabled: false },
  { text: "Projectos Decorridos", disabled: false },
] as NavbarOption[];

const GlobalVillageOptions = [
  { text: "Pinhel", disabled: false },
  { text: "O Projecto", disabled: false },
  { text: "Missão e Valores", disabled: false },
  { text: "Objectivos", disabled: false },
  { text: "Donate", disabled: false },
] as NavbarOption[];

const Navbar = () => {
  return (
    <div className="flex gap-3 bg-orange-100 px-14">
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
      <div className="my-auto ml-auto flex gap-3">
        <ul className="flex flex-row gap-8 px-1">
          <li>
            <MenuItem title="ONG" options={NGODropdownOptions} />
          </li>
          {/* <li>
            <MenuItem title="Atividades" options={AtivitiesDropdownOptions} />
          </li> */}
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
