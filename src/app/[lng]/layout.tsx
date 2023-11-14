import '@/app/globals.css';
import { Inter } from 'next/font/google';
import { dir } from 'i18next';

import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/footer/Footer';
import AppProvider from '@/contexts/AppProvider';
import MobileNavbar from '@/components/navbar/MobileNavbar';

const inter = Inter({ subsets: ['latin'] });

import { languages } from '../i18n/settings';

export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }));
}

export default async function RootLayout({
  children,
  lng,
}: {
  children: React.ReactNode;
  lng: string;
}) {
  console.log(lng);
  return (
    <html lang={lng}>
      <AppProvider>
        <body className={inter.className}>
          <MobileNavbar lng={lng} />
          <Navbar lng={lng} />
          <main className='bg-body min-h-screen'>{children}</main>
          <Footer lng={lng} />
        </body>
      </AppProvider>
    </html>
  );
}
