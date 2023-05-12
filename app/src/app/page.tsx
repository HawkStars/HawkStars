import Image from "next/image";
import Link from "next/link";
import { AiOutlineInstagram, AiOutlineMail } from "react-icons/ai";
import { FaFacebookF } from "react-icons/fa";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-5">
      <Image
        src="/logo.png"
        alt="Hawk Stars Logo"
        className="dark:invert"
        width={400}
        height={300}
        priority
      />
      <div className="mt-10 text-xl">Maintenance Mode</div>
      <div className="flex justify-center gap-3">
        <Link target="_blank" href="https://www.instagram.com/hawk.starsngo/">
          <AiOutlineInstagram size={32} />
        </Link>
        <Link href="https://www.facebook.com/hawkstarsngo" target="_blank">
          <FaFacebookF size={26} />
        </Link>
        <Link href="mailto:hawkstarsngo@gmail.com">
          <AiOutlineMail size={32} />
        </Link>
      </div>
    </main>
  );
}
