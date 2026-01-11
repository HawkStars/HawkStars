import '@/app/globals.css';
import { Inter } from 'next/font/google';
import { Oswald } from 'next/font/google';

const inter = Inter({ variable: '--font-inter', subsets: ['latin'], display: 'swap' });
const oswald = Oswald({ variable: '--font-oswald', subsets: ['latin'], display: 'swap' });

import { Metadata } from 'next';
import { headers } from 'next/headers';
import Script from 'next/script';
import { getMetadataPageInfo } from '@/utils/metadata';
import Footer from '@/components/footer/Footer';
import AppProvider from '@/utils/contexts/AppProvider';
import { LanguagePageProps } from './types';
import { Language, fallbackLng, languages } from '@/i18n/settings';
import { getFooterQuery, getHeaderQuery } from '@/lib/payload/queries/navbar';
import MobileNavbar from '@/components/navbar/MobileNavbar';
import Navbar from '@/components/navbar/Navbar';

export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }));
}

export async function generateMetadata(props: LanguagePageProps): Promise<Metadata> {
  const params = await props.params;
  const { lng } = params;

  const metadataPage = getMetadataPageInfo((lng || fallbackLng) as Language, 'home');
  return metadataPage;
}

export default async function RootLayout(props: {
  children: React.ReactNode;
  params: Promise<{ lng?: string }>;
}) {
  await headers();
  const params = await props.params;
  const { lng } = params;
  const { children } = props;

  const headerInfo = await getHeaderQuery(lng as Language);
  const footerInfo = await getFooterQuery(lng as Language);

  return (
    <html lang={lng} data-color-mode='light' className={`${inter.variable} ${oswald.variable}`}>
      <AppProvider
        lng={(lng as Language) || fallbackLng}
        headerInfo={headerInfo}
        footerInfo={footerInfo}
      >
        <body>
          <MobileNavbar />
          <Navbar />
          <main className='bg-body min-h-screen'>{children}</main>
          <Footer />
        </body>
      </AppProvider>
      <Script async src='https://www.googletagmanager.com/gtag/js?id=G-PEH83S3H3K'></Script>
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
