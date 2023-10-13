import HomeComponent from "@/components/home/HomeComponent";
import { Metadata } from "next";

export const metadata = {
  title: "Hawk Stars - Home",
  description: `Grupo intergeracional cujo os seus membros são interessados no
    desenvolvimento social e humano tendo por base um trabalho na área
    da educação com a inovação a que os novos tempos obrigam, aberta a
    todos, e projetada do local para o global.`,
  icons: {
    icon: "/favicon/favicon.ico",
    shortcut: "/favicon/favicon-16x16.png",
    apple: "/favicon/apple-touch-icon.png",
  },
} as Metadata;

type HomeProps = {
  params: {
    lng: string;
  };
};

export default function Home({ params: { lng } }: HomeProps) {
  return <HomeComponent />;
}
