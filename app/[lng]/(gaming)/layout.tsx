import '@/app/globals.css';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import { Metadata } from 'next';
import GamingNavbar from '@/components/gaming/GamingNavbar';
import GamingFooter from '@/components/gaming/GamingFooter';
import { fallbackLng, languages } from '@/i18n/settings';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Hawkis E-Sports | Hawk Stars NGO Gaming Division',
  description:
    'The competitive gaming division of Hawk Stars NGO. Training the next generation of e-sports talent from Pinhel to the world.',
  icons: {
    icon: '/favicon.ico',
  },
};

export function generateStaticParams() {
  return languages.map((lng) => ({ lng }));
}

export default async function GamingLayout(props: {
  children: React.ReactNode;
  params: Promise<{ lng?: string }>;
}) {
  const params = await props.params;
  const lng = params.lng || fallbackLng;
  const { children } = props;

  return (
    <html lang={lng} className={`${inter.variable}`}>
      <body className='bg-gaming-bg text-gaming-text font-[Inter,sans-serif] antialiased'>
        {/* Background ambient effects */}
        <div className='pointer-events-none fixed inset-0 z-0'>
          {/* Top-left cyan glow */}
          <div
            className='absolute -top-40 -left-40 h-125 w-125 rounded-full opacity-[0.07]'
            style={{
              background: 'radial-gradient(circle, #00f0ff 0%, transparent 70%)',
            }}
          />
          {/* Bottom-right purple glow */}
          <div
            className='absolute -right-40 -bottom-40 h-150 w-150 rounded-full opacity-[0.05]'
            style={{
              background: 'radial-gradient(circle, #7b2ff7 0%, transparent 70%)',
            }}
          />
          {/* Subtle grid pattern */}
          <div
            className='absolute inset-0 opacity-[0.03]'
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        {/* Content */}
        <div className='relative z-10 flex min-h-screen flex-col'>
          <GamingNavbar lng={lng} />
          <main className='flex-1'>{children}</main>
          <GamingFooter lng={lng} />
        </div>

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
