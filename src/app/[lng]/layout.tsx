import '@/app/globals.css';
import { Inter } from 'next/font/google';

import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/footer/Footer';
import AppProvider from '@/contexts/AppProvider';
import MobileNavbar from '@/components/navbar/MobileNavbar';

const inter = Inter({ subsets: ['latin'] });

import { fallbackLng, languages } from '../../i18n/settings';

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
  return (
    <html lang={lng || fallbackLng}>
      <AppProvider lng={lng || fallbackLng}>
        <body className={inter.className}>
          <MobileNavbar />
          <Navbar />
          <main className='bg-body min-h-screen'>{children}</main>
          <Footer />
        </body>
      </AppProvider>
    </html>
  );
}
