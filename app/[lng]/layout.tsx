import '@/app/globals.css';
import { Inter } from 'next/font/google';

import Navbar from '../../components/navbar/Navbar';
import Footer from '../../components/footer/Footer';
import AppProvider from '../../contexts/AppProvider';
import MobileNavbar from '../../components/navbar/MobileNavbar';

const inter = Inter({ subsets: ['latin'] });

import { languages } from '../../i18n/settings';

import { Metadata } from 'next';
import Script from 'next/script';
import { getMetadataPageInfo } from '@/utils/metadata';
import { LanguagePageProps } from './types';

export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }));
}

export async function generateMetadata({
  params,
}: LanguagePageProps): Promise<Metadata> {
  const { lng } = params;
  const metadataPage = getMetadataPageInfo(lng, 'home');
  return metadataPage;
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
          <MobileNavbar />
          <Navbar />
          <main className='bg-body min-h-screen'>{children}</main>
          <Footer />
        </body>
      </AppProvider>
      <Script src='https://www.googletagmanager.com/gtag/js?id=G-PEH83S3H3K'></Script>
      <Script id='google-analytics'>
        {`window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-PEH83S3H3K');
        `}
      </Script>
    </html>
  );
}
