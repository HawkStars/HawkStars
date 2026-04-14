import '@/app/globals.css';
import { Inter } from 'next/font/google';
import { Oswald } from 'next/font/google';
import Script from 'next/script';
import { fallbackLng, languages } from '@/i18n/settings';
import CrowdfundingNavbar from '@/components/Crowdfunding/CrowdfundingNavbar';

const inter = Inter({ variable: '--font-inter', subsets: ['latin'], display: 'swap' });
const oswald = Oswald({ variable: '--font-oswald', subsets: ['latin'], display: 'swap' });

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
    <html lang={lng} className={`${inter.variable} ${oswald.variable}`}>
      <body className='bg-crowdfunding-bg'>
        <CrowdfundingNavbar lng={lng} />
        <main>{children}</main>

        <Script async src='https://www.googletagmanager.com/gtag/js?id=G-PEH83S3H3K' />
        <Script id='google-analytics'>
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
