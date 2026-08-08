import '@/app/globals.css';
import { Inter } from 'next/font/google';
import { Oswald } from 'next/font/google';

const inter = Inter({ variable: '--font-inter', subsets: ['latin'], display: 'swap' });
const oswald = Oswald({ variable: '--font-oswald', subsets: ['latin'], display: 'swap' });

import Script from 'next/script';
import { Suspense } from 'react';
import { getServerTranslation } from '@/i18n';
import AppProvider from '@/utils/contexts/AppProvider';
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

export const instant = false;

export default async function RootLayout(props: {
  children: React.ReactNode;
  params: Promise<{ lng: string }>;
}) {
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
        <SkipToContent lng={lng} />
        <Suspense fallback={<></>}>
          <LayoutContent lng={lng}>{children}</LayoutContent>
        </Suspense>

        <Script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy='afterInteractive'
        />
        <Script id='google-analytics' strategy='afterInteractive'>
          {`window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
        </Script>
      </body>
    </html>
  );
}

// A11Y-M2 (WCAG 2.4.1): the skip link must be the first focusable element in the
// document, ahead of the multi-column navbar. It is visually hidden until focused.
//
// `'use cache'` is REQUIRED here, not cosmetic: with `cacheComponents` enabled,
// awaiting `getServerTranslation` directly in RootLayout counts as uncached data
// accessed outside <Suspense>, which makes every route in this group blocking and
// unprerenderable (https://nextjs.org/docs/messages/blocking-route). The label
// depends only on `lng`, so caching it is both correct and free.
async function SkipToContent({ lng }: { lng: string }) {
  'use cache';
  const { t } = await getServerTranslation((lng || fallbackLng) as Language, 'common');

  return (
    <a
      href='#main-content'
      className='focus:ring-primary sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-999 focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-black focus:ring-2'
    >
      {t('a11y.skipToContent')}
    </a>
  );
}

async function LayoutContent({ children, lng }: { children: React.ReactNode; lng: string }) {
  const [headerInfo, footerInfo] = await Promise.all([
    getHeaderQuery(lng as Language),
    getFooterQuery(lng as Language),
  ]);

  return (
    <AppProvider lng={(lng as Language) || fallbackLng}>
      <MobileNavbar headerInfo={headerInfo} />
      <Navbar headerInfo={headerInfo} lng={lng as Language} />
      <main id='main-content' className='bg-body relative min-h-screen'>
        {/* The boundary belongs around `{children}` only, not around the whole
            tree. A <Suspense> returned by LayoutContent cannot defer
            LayoutContent's own awaits above — those already resolved before
            this JSX existed, so wrapping the navbar/footer in it achieves
            nothing (RootLayout's <Suspense> around <LayoutContent> is what
            actually defers this component). Wrapping only `{children}` is
            what buys something real: the chrome streams as soon as the
            header/footer queries resolve, instead of waiting on whatever
            slower data the page underneath is fetching. */}
        <Suspense fallback={<></>}>{children}</Suspense>
      </main>
      <FooterContainer footerInfo={footerInfo} lng={lng as Language} />
    </AppProvider>
  );
}
