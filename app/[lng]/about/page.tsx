import { Metadata } from 'next';
import { defaultMetadata } from '../../metadata';
import AboutPage from '../../../components/about/AboutPage';
import { useTranslation } from '../../../i18n';

export const metadata = {
  title: 'Hawk Stars - About Us',
  description:
    'Hawk Stars objetives and values and main goals for the next years for the international community and local ativities',
  ...defaultMetadata,
} as Metadata;

const Index = async ({ params: { lng } }: { params: { lng: string } }) => {
  const { t } = await useTranslation(lng);
  return <AboutPage t={t} />;
};

export default Index;
