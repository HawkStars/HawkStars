import '@/app/globals.css';
import { Inter } from 'next/font/google';
import { Oswald } from 'next/font/google';

const inter = Inter({ variable: '--font-inter', subsets: ['latin'], display: 'swap' });
const oswald = Oswald({ variable: '--font-oswald', subsets: ['latin'], display: 'swap' });

import { Metadata } from 'next';
import Script from 'next/script';
import { Suspense } from 'react';
import { headers } from 'next/headers';
import { getMetadataPageInfo } from '@/utils/metadata';
import AppProvider from '@/utils/contexts/AppProvider';
import { LanguagePageProps } from './types';
import { Language, fallbackLng, languages } from '@/i18n/settings';
import { getFooterQuery, getHeaderQuery } from '@/lib/payload/queries/navbar';
import MobileNavbar from '@/components/navbar/MobileNavbar';
import { OrganizationJsonLd } from '@/components/seo/JsonLd';
import { GA_MEASUREMENT_ID } from '@/lib/constants';
import Navbar from '@/components/navbar/Navbar';
import FooterContainer from '@/components/footer/Footer';

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
  params: Promise<{ lng: string }>;
}) {
  const nonce = (await headers()).get('x-nonce') || '';
  const params = await props.params;
  const { lng } = params;
  const { children } = props;

  return (
    <html
      lang={lng}
      data-scroll-behavior='smooth'
      data-color-mode='light'
      className={`${inter.variable} ${oswald.variable}`}
    >
      <head>
        <OrganizationJsonLd lng={lng || 'pt'} />
      </head>
      <body>
        <Suspense fallback={<></>}>
          <LayoutContent lng={lng}>{children}</LayoutContent>
        </Suspense>
      </body>
      <Suspense fallback={<></>}>
        <Script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy='afterInteractive'
          nonce={nonce}
        />
        <Script id='google-analytics' strategy='afterInteractive' nonce={nonce}>
          {`window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
        </Script>
      </Suspense>
    </html>
  );
}

async function LayoutContent({ children, lng }: { children: React.ReactNode; lng: string }) {
  'use cache';
  const [headerInfo, footerInfo] = await Promise.all([
    getHeaderQuery(lng as Language),
    getFooterQuery(lng as Language),
  ]);

  return (
    <AppProvider lng={(lng as Language) || fallbackLng}>
      <MobileNavbar headerInfo={headerInfo} />
      <Navbar headerInfo={headerInfo} lng={lng as Language} />
      <main className='bg-body relative min-h-screen'>{children}</main>
      <FooterContainer footerInfo={footerInfo} lng={lng as Language} />
    </AppProvider>
  );
}
