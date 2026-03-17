import Link from 'next/link';

type GamingFooterProps = {
  lng: string;
};

const SOCIAL_LINKS = [
  { label: 'Discord', href: '#' },
  { label: 'Twitch', href: '#' },
  { label: 'YouTube', href: '#' },
  { label: 'X / Twitter', href: '#' },
];

const GamingFooter = ({ lng }: GamingFooterProps) => {
  return (
    <footer className='border-gaming-border bg-gaming-bg border-t'>
      <div className='mx-auto max-w-7xl px-4 py-12 lg:px-8'>
        <div className='grid gap-10 md:grid-cols-3'>
          {/* Brand */}
          <div className='flex flex-col gap-4'>
            <span className='font-magistral text-2xl tracking-wider text-white uppercase'>
              Hawkis <span className='text-gaming-accent'>E-Sports</span>
            </span>
            <p className='text-gaming-text-muted max-w-xs text-sm leading-relaxed'>
              The competitive gaming division of Hawk Stars NGO. Training the next generation of
              e-sports talent from Pinhel to the world.
            </p>
          </div>

          {/* Quick links */}
          <div className='flex flex-col gap-3'>
            <h4 className='font-magistral text-gaming-text text-sm tracking-widest uppercase'>
              Quick Links
            </h4>
            <div className='flex flex-col gap-2'>
              <Link
                href={`/${lng}/gaming`}
                className='text-gaming-text-muted hover:text-gaming-accent text-sm transition-colors'
              >
                Home
              </Link>
              <Link
                href={`/${lng}/gaming/teams`}
                className='text-gaming-text-muted hover:text-gaming-accent text-sm transition-colors'
              >
                Our Teams
              </Link>
              <Link
                href={`/${lng}/gaming/academy`}
                className='text-gaming-text-muted hover:text-gaming-accent text-sm transition-colors'
              >
                Gaming Academy
              </Link>
              <Link
                href={`/${lng}`}
                className='text-gaming-text-muted hover:text-gaming-text text-sm transition-colors'
              >
                &larr; Hawk Stars NGO
              </Link>
            </div>
          </div>

          {/* Social */}
          <div className='flex flex-col gap-3'>
            <h4 className='font-magistral text-gaming-text text-sm tracking-widest uppercase'>
              Connect
            </h4>
            <div className='flex flex-wrap gap-2'>
              {SOCIAL_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className='border-gaming-border bg-gaming-surface text-gaming-text-muted hover:border-gaming-accent/30 hover:text-gaming-accent rounded-lg border px-4 py-2 text-xs font-medium transition-all duration-200'
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className='border-gaming-border mt-10 flex flex-col items-center justify-between gap-4 border-t pt-6 md:flex-row'>
          <p className='text-gaming-text-muted text-xs'>
            &copy; {new Date().getFullYear()} Hawkis E-Sports &mdash; A Hawk Stars NGO initiative
          </p>
          <div className='flex gap-4'>
            <Link
              href={`/${lng}/store/terms`}
              className='text-gaming-text-muted hover:text-gaming-text text-xs transition-colors'
            >
              Terms
            </Link>
            <Link
              href={`/${lng}/transparency`}
              className='text-gaming-text-muted hover:text-gaming-text text-xs transition-colors'
            >
              Transparency
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default GamingFooter;
