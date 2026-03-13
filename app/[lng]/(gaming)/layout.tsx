import Script from 'next/script';

export default async function RootLayout(props: {
  children: React.ReactNode;
  params: Promise<{ lng?: string }>;
}) {
  const params = await props.params;
  const { lng } = params;
  const { children } = props;

  return (
    <html lang={lng}>
      <body>{children}</body>
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
