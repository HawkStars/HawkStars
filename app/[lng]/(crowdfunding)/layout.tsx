import '@/app/globals.css';
import { Inter } from 'next/font/google';
import { Oswald } from 'next/font/google';
import Script from 'next/script';
import { headers } from 'next/headers';
import { fallbackLng, Language, languages } from '@/i18n/settings';
import CrowdfundingNavbar from '@/components/Crowdfunding/CrowdfundingNavbar';
import AppProvider from '@/utils/contexts/AppProvider';
import { Suspense } from 'react';
import { Metadata } from 'next';
import { BASE_URL, OG_IMAGE_FALLBACK, SITE_NAME } from '@/lib/constants';

const inter = Inter({ variable: '--font-inter', subsets: ['latin'], display: 'swap' });
const oswald = Oswald({ variable: '--font-oswald', subsets: ['latin'], display: 'swap' });

const CROWDFUNDING_PATH = '/crowdfunding';

export async function generateMetadata(props: {
  params: Promise<{ lng?: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const lng = params.lng || fallbackLng;
  const canonicalUrl = `${BASE_URL}/${lng}${CROWDFUNDING_PATH}`;

  return {
    title: `Support Hawk Stars NGO | Crowdfunding Campaign`,
    description: `Help us build the Global Village in Pinhel, Portugal. Support Hawk Stars NGO's crowdfunding campaign and be part of a vision for sustainable development and community.`,
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'x-default': `/pt${CROWDFUNDING_PATH}`,
        en: `/en${CROWDFUNDING_PATH}`,
        pt: `/pt${CROWDFUNDING_PATH}`,
      },
    },
    openGraph: {
      type: 'website',
      title: `Support Hawk Stars NGO | Crowdfunding Campaign`,
      description: `Help us build the Global Village in Pinhel, Portugal. Support Hawk Stars NGO's crowdfunding campaign.`,
      url: canonicalUrl,
      siteName: SITE_NAME,
      images: [
        { url: OG_IMAGE_FALLBACK, width: 1200, height: 630, alt: 'Hawk Stars NGO Crowdfunding' },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `Support Hawk Stars NGO | Crowdfunding Campaign`,
      description: `Help us build the Global Village in Pinhel, Portugal.`,
      images: [OG_IMAGE_FALLBACK],
    },
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
  const nonce = (await headers()).get('x-nonce') || undefined;

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

        <Suspense fallback={<></>}>
          <Script
            strategy='afterInteractive'
            src='https://www.googletagmanager.com/gtag/js?id=G-PEH83S3H3K'
            nonce={nonce}
          />
          <Script id='google-analytics' strategy='afterInteractive' nonce={nonce}>
            {`window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-PEH83S3H3K');
          `}
          </Script>
        </Suspense>
      </body>
    </html>
  );
}

async function LayoutContent({ children, lng }: { children: React.ReactNode; lng: string }) {
  return (
    <AppProvider lng={(lng as Language) || fallbackLng}>
      <CrowdfundingNavbar />
      <main>{children}</main>
    </AppProvider>
  );
}
