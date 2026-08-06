import Link from 'next/link';

export const metadata = {
  title: '404 - Page Not Found | Hawk Stars NGO',
  robots: 'noindex, nofollow',
};

export default function RootNotFound() {
  return (
    <html lang='pt'>
      <body
        style={{
          display: 'flex',
          minHeight: '100vh',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          fontFamily: 'sans-serif',
          padding: '2rem',
        }}
      >
        <h1>404</h1>
        <p>Página não encontrada / Page not found</p>
        <Link href='/pt' style={{ marginTop: '1rem' }}>
          &larr; Voltar ao início / Back to home
        </Link>
      </body>
    </html>
  );
}
