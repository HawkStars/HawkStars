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
    <footer className='border-t border-gaming-border bg-gaming-bg'>
      <div className='mx-auto max-w-7xl px-4 py-12 lg:px-8'>
        <div className='grid gap-10 md:grid-cols-3'>
          {/* Brand */}
          <div className='flex flex-col gap-4'>
            <span className='font-magistral text-2xl tracking-wider text-white uppercase'>
              Hawkis <span className='text-gaming-accent'>E-Sports</span>
            </span>
            <p className='max-w-xs text-sm leading-relaxed text-gaming-text-muted'>
              The competitive gaming division of Hawk Stars NGO. Training the next generation of
              e-sports talent from Pinhel to the world.
            </p>
          </div>

          {/* Quick links */}
          <div className='flex flex-col gap-3'>
            <h4 className='font-magistral text-sm tracking-widest text-gaming-text uppercase'>
              Quick Links
            </h4>
            <div className='flex flex-col gap-2'>
              <Link
                href={`/${lng}/gaming`}
                className='text-sm text-gaming-text-muted transition-colors hover:text-gaming-accent'
              >
                Home
              </Link>
              <Link
                href={`/${lng}/gaming/teams`}
                className='text-sm text-gaming-text-muted transition-colors hover:text-gaming-accent'
              >
                Our Teams
              </Link>
              <Link
                href={`/${lng}/gaming/academy`}
                className='text-sm text-gaming-text-muted transition-colors hover:text-gaming-accent'
              >
                Gaming Academy
              </Link>
              <Link
                href={`/${lng}`}
                className='text-sm text-gaming-text-muted transition-colors hover:text-gaming-text'
              >
                &larr; Hawk Stars NGO
              </Link>
            </div>
          </div>

          {/* Social */}
          <div className='flex flex-col gap-3'>
            <h4 className='font-magistral text-sm tracking-widest text-gaming-text uppercase'>
              Connect
            </h4>
            <div className='flex flex-wrap gap-2'>
              {SOCIAL_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className='rounded-lg border border-gaming-border bg-gaming-surface px-4 py-2 text-xs font-medium text-gaming-text-muted transition-all duration-200 hover:border-gaming-accent/30 hover:text-gaming-accent'
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className='mt-10 flex flex-col items-center justify-between gap-4 border-t border-gaming-border pt-6 md:flex-row'>
          <p className='text-xs text-gaming-text-muted'>
            &copy; {new Date().getFullYear()} Hawkis E-Sports &mdash; A Hawk Stars NGO initiative
          </p>
          <div className='flex gap-4'>
            <Link
              href={`/${lng}/store/terms`}
              className='text-xs text-gaming-text-muted transition-colors hover:text-gaming-text'
            >
              Terms
            </Link>
            <Link
              href={`/${lng}/transparency`}
              className='text-xs text-gaming-text-muted transition-colors hover:text-gaming-text'
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
