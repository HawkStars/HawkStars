import Avatar from "../utils/Avatar";
import { RiLinkedinLine } from "react-icons/ri";
import Link from "next/link";

type TeamCardProps = {
  name: string;
  position: string;
  photo: string;
  url: string;
};

const TeamCard = ({ name, position, photo, url }: TeamCardProps) => {
  return (
    <div className="flex flex-col gap-3">
      <Avatar url={photo} />
      <h4>{name}</h4>
      <h6>{position}</h6>
      <div className="flex justify-center">
        <Link href={url}>
          <RiLinkedinLine size={32} />
        </Link>
      </div>
    </div>
  );
};

export default TeamCard;
