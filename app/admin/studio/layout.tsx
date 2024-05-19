import '@/app/globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

import Footer from '@/components/footer/Footer';
import MobileNavbar from '@/components/navbar/MobileNavbar';
import Navbar from '@/components/navbar/Navbar';
import AppProvider from '@/contexts/AppProvider';

import { fallbackLng } from '@/i18n/settings';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={fallbackLng}>
      <AppProvider lng={fallbackLng}>
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
