import '@/app/globals.css';
import { Inter } from 'next/font/google';

import Navbar from '../../components/navbar/Navbar';
import Footer from '../../components/footer/Footer';
import AppProvider from '../../contexts/AppProvider';
import MobileNavbar from '../../components/navbar/MobileNavbar';

const inter = Inter({ subsets: ['latin'] });

import { languages } from '../../i18n/settings';
import { Suspense } from 'react';

export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }));
}

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
