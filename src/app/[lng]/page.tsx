import HomeComponent from '@/components/home/HomeComponent';
import { Metadata } from 'next';
import { defaultMetadata } from '../metadata';
import { useTranslation } from '../../i18n';

export const metadata = {
  title: 'Hawk Stars - Home',
  description: `Grupo intergeracional cujo os seus membros são interessados no
    desenvolvimento social e humano tendo por base um trabalho na área
    da educação com a inovação a que os novos tempos obrigam, aberta a
    todos, e projetada do local para o global.`,
  ...defaultMetadata,
} as Metadata;

type HomeProps = {
  params: {
    lng: string;
  };
};

export default async function Home({
  params: { lng },
}: {
  params: { lng: string };
}) {
  const { t } = await useTranslation(lng);
  return <HomeComponent lng={lng} />;
}
