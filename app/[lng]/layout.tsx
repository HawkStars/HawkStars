import '@/app/globals.css';
import { Inter } from 'next/font/google';

import Navbar from '../../components/navbar/Navbar';
import Footer from '../../components/footer/Footer';
import AppProvider from '../../contexts/AppProvider';
import MobileNavbar from '../../components/navbar/MobileNavbar';

const inter = Inter({ subsets: ['latin'] });

import { languages } from '../../i18n/settings';
import { Suspense } from 'react';
import { defaultMetadata } from '@/metadata';
import { Metadata } from 'next';

export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }));
}

export const metadata = {
  title: 'Hawk Stars',
  description: `Grupo intergeracional cujo os seus membros são interessados no
    desenvolvimento social e humano tendo por base um trabalho na área
    da educação com a inovação a que os novos tempos obrigam, aberta a
    todos, e projetada do local para o global.`,
  ...defaultMetadata,
} as Metadata;

export default async function RootLayout({
  children,
  params: { lng },
}: {
  children: React.ReactNode;
  params: { lng: string };
}) {
  return (
    <html lang={lng}>
      <AppProvider lng={lng}>
        <body className={inter.className}>
          <Suspense fallback={<></>}>
            <MobileNavbar />
          </Suspense>
          <Navbar />
          <main className='bg-body min-h-screen'>{children}</main>
          <Footer />
        </body>
      </AppProvider>
    </html>
  );
}
