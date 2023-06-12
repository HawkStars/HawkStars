import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-5">
      <Image
        src="/logo.png"
        alt="Hawk Stars Logo"
        // className="dark:invert"
        width={400}
        height={300}
        priority
      />
    </main>
  );
}
