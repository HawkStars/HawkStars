import '@/app/globals.css';
import { Inter } from 'next/font/google';
import { Oswald } from 'next/font/google';
import Script from 'next/script';
import { fallbackLng, Language, languages } from '@/i18n/settings';
import CrowdfundingNavbar from '@/components/Crowdfunding/CrowdfundingNavbar';
import AppProvider from '@/utils/contexts/AppProvider';
import SkipToContent from '@/components/a11y/SkipToContent';
import { Suspense } from 'react';
import { Metadata } from 'next';
import { getMetadataPageInfo } from '@/utils/metadata';

const inter = Inter({ variable: '--font-inter', subsets: ['latin'], display: 'swap' });
const oswald = Oswald({ variable: '--font-oswald', subsets: ['latin'], display: 'swap' });

export async function generateMetadata(props: {
  params: Promise<{ lng?: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const lng = (languages.includes(params.lng as Language) ? params.lng : fallbackLng) as Language;

  // Title, description and both social cards used to be English literals here,
  // so /pt/crowdfunding declared <html lang="pt"> with an English <title>, and the
  // pt/en hreflang pair advertised two URLs with byte-identical metadata. The
  // copy lives in i18n/locales/{pt,en}/metadata.json like every other route.
  return {
    ...getMetadataPageInfo(lng, 'crowdfunding'),
    icons: { icon: '/favicon.ico' },
  };
}

export function generateStaticParams() {
  return languages.map((lng) => ({ lng }));
}

export default async function CrowdfundingLayout(props: {
  children: React.ReactNode;
  params: Promise<{ lng?: string }>;
}) {
  const params = await props.params;
  const lng = params.lng || fallbackLng;
  const { children } = props;

  return (
    <html
      lang={lng}
      className={`${inter.variable} ${oswald.variable}`}
      data-scroll-behavior='smooth'
    >
      <body className='bg-crowdfunding-bg'>
        <Suspense fallback={<></>}>
          <LayoutContent lng={lng}>{children}</LayoutContent>
        </Suspense>

        <Script
          strategy='afterInteractive'
          src='https://www.googletagmanager.com/gtag/js?id=G-PEH83S3H3K'
        />
        <Script id='google-analytics' strategy='afterInteractive'>
          {`window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-PEH83S3H3K');
          `}
        </Script>
      </body>
    </html>
  );
}

async function LayoutContent({ children, lng }: { children: React.ReactNode; lng: string }) {
  return (
    <AppProvider lng={(lng as Language) || fallbackLng}>
      <Suspense fallback={<></>}>
        <SkipToContent lng={lng} />
      </Suspense>
      <CrowdfundingNavbar />
      <main id='main-content'>{children}</main>
    </AppProvider>
  );
}
