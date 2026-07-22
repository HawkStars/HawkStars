import Link from 'next/link';

import { getServerTranslation } from '@/i18n';

type GamingFooterProps = {
  lng: string;
};

const SOCIAL_LINKS = [
  { label: 'Discord', href: '#' },
  { label: 'Twitch', href: '#' },
  { label: 'YouTube', href: '#' },
  { label: 'X / Twitter', href: '#' },
];

const GamingFooter = async ({ lng }: GamingFooterProps) => {
  const { t } = await getServerTranslation(lng, 'gaming');

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
              {t('footer.description')}
            </p>
          </div>

          {/* Quick links */}
          <div className='flex flex-col gap-3'>
            <h4 className='font-magistral text-gaming-text text-sm tracking-widest uppercase'>
              {t('footer.quickLinks')}
            </h4>
            <div className='flex flex-col gap-2'>
              <Link
                href={`/${lng}/gaming`}
                className='text-gaming-text-muted hover:text-gaming-accent text-sm transition-colors'
              >
                {t('footer.home')}
              </Link>
              <Link
                href={`/${lng}/gaming/teams`}
                className='text-gaming-text-muted hover:text-gaming-accent text-sm transition-colors'
              >
                {t('footer.ourTeams')}
              </Link>
              <Link
                href={`/${lng}/gaming/academy`}
                className='text-gaming-text-muted hover:text-gaming-accent text-sm transition-colors'
              >
                {t('footer.gamingAcademy')}
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
              {t('footer.connect')}
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
            {t('footer.copyright', { year: new Date().getFullYear() })}
          </p>
          <div className='flex gap-4'>
            <Link
              href={`/${lng}/store/terms`}
              className='text-gaming-text-muted hover:text-gaming-text text-xs transition-colors'
            >
              {t('footer.terms')}
            </Link>
            <Link
              href={`/${lng}/transparency`}
              className='text-gaming-text-muted hover:text-gaming-text text-xs transition-colors'
            >
              {t('footer.transparency')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default GamingFooter;
