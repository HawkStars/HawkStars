import Avatar from "../utils/Avatar";
import { BsLinkedin } from "react-icons/bs";
import Link from "next/link";

type TeamCardProps = {
  name: string;
  position: string;
  photo: string;
  url?: string;
};

const TeamCard = ({ name, position, photo, url }: TeamCardProps) => {
  return (
    <div className="flex h-72 w-56 flex-col bg-bege-light px-2 py-4 text-center">
      <div className="mt-2 flex justify-center">
        <Avatar url={photo} size="medium" />
      </div>
      <div className="mt-7">
        <h4 className="font-black">{name}</h4>
        <h6>{position}</h6>
      </div>
      {url && (
        <div className="mt-auto flex justify-center">
          <Link href={url}>
            <BsLinkedin size={32} color="#0072b1" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default TeamCard;
