import '@/app/globals.css';
import { Inter } from 'next/font/google';

import Navbar from '../../components/navbar/Navbar';
import Footer from '../../components/footer/Footer';
import AppProvider from '../../contexts/AppProvider';
import MobileNavbar from '../../components/navbar/MobileNavbar';

const inter = Inter({ subsets: ['latin'] });

import { Suspense } from 'react';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <AppProvider lng='en'>
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
