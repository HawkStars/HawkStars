import Link from "next/link";
import { AiOutlineInstagram, AiOutlineMail } from "react-icons/ai";
import { FaFacebookF } from "react-icons/fa";

const Socials = () => {
  return (
    <div className="flex justify-center gap-1">
      <Link target="_blank" href="https://www.instagram.com/hawk.starsngo/">
        <AiOutlineInstagram size={24} />
      </Link>
      <Link href="https://www.facebook.com/hawkstarsngo" target="_blank">
        <FaFacebookF size={20} />
      </Link>
      <Link href="mailto:hawkstarsngo@gmail.com">
        <AiOutlineMail size={24} />
      </Link>
    </div>
  );
};

export default Socials;
