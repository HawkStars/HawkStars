import '@/app/globals.css';
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import Script from 'next/script';
import { Suspense } from 'react';
import AppProvider from '@/utils/contexts/AppProvider';
import { Language, fallbackLng, languages } from '@/i18n/settings';
import { GA_MEASUREMENT_ID } from '@/lib/constants';
import { getGallerySettings } from '@/lib/payload/queries/artwork';
import GalleryNavbar from '@/components/art/layout/GalleryNavbar';
import GalleryFooter from '@/components/art/layout/GalleryFooter';

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  style: ['normal', 'italic'],
  display: 'swap',
});
const jakarta = Plus_Jakarta_Sans({
  variable: '--font-jakarta',
  subsets: ['latin'],
  display: 'swap',
});

export function generateStaticParams() {
  return languages.map((lng) => ({ lng }));
}

/**
 * The Art Gallery is its own sub-site (like crowdfunding): dark "museum at
 * night" theme, its own navbar and footer. Its URLs (/art, /artwork, /artist,
 * /curator) are unchanged — only the route group moved out of (org).
 */
export default async function GalleryLayout(props: {
  children: React.ReactNode;
  params: Promise<{ lng: string }>;
}) {
  const { lng: rawLng } = await props.params;
  const lng = (languages as readonly string[]).includes(rawLng)
    ? (rawLng as Language)
    : fallbackLng;
  const settings = await getGallerySettings(lng);

  return (
    <html
      lang={lng}
      data-scroll-behavior='smooth'
      className={`${playfair.variable} ${jakarta.variable} bg-art-charcoal`}
    >
      <body className='bg-art-charcoal text-art-text font-art-sans min-h-screen antialiased'>
        <AppProvider lng={lng}>
          <Suspense>
            <GalleryNavbar lng={lng} />
          </Suspense>
          <main id='main-content'>
            <Suspense fallback={null}>{props.children}</Suspense>
          </main>
          <GalleryFooter lng={lng} settings={settings} />
        </AppProvider>

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
