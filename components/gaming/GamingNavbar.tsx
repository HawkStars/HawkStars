'use client';

import { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

type GamingNavbarProps = {
  lng: string;
};

const NAV_LINKS = [
  { label: 'Home', href: '/gaming' },
  { label: 'Teams', href: '/gaming/teams' },
  { label: 'Tournaments', href: '/gaming/tournaments' },
  { label: 'Academy', href: '/gaming/academy' },
  { label: 'News', href: '/gaming/news' },
];

const GamingNavbar = ({ lng }: GamingNavbarProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className='border-gaming-border bg-gaming-bg/90 sticky top-0 z-50 border-b backdrop-blur-xl'>
      <div className='mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8'>
        {/* Logo */}
        <Link href={`/${lng}/gaming`} className='flex items-center gap-3'>
          <div className='from-gaming-accent to-gaming-accent-secondary flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br'>
            <svg width='20' height='20' viewBox='0 0 24 24' fill='none'>
              <path
                d='M6 12h4m4 0h4M8 8l-2 4 2 4m8-8l2 4-2 4'
                stroke='white'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          </div>
          <span className='font-magistral text-xl tracking-wider text-white uppercase'>Hawkis</span>
        </Link>

        {/* Desktop links */}
        <div className='hidden items-center gap-1 md:flex'>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={`/${lng}${link.href}`}
              className='text-gaming-text-muted hover:bg-gaming-surface-light hover:text-gaming-accent rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200'
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className='flex items-center gap-3'>
          {/* Back to main site */}
          <Link
            href={`/${lng}`}
            className='text-gaming-text-muted hover:text-gaming-text hidden text-xs transition-colors md:block'
          >
            hawkstars.org
          </Link>

          {/* CTA */}
          <Link
            href={`/${lng}/gaming/academy`}
            className='font-magistral gaming-gradient-border bg-gaming-surface text-gaming-accent hover:bg-gaming-surface-light rounded-lg px-4 py-2 text-sm tracking-wide transition-all duration-300'
          >
            Join Academy
          </Link>

          {/* Mobile burger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className='bg-gaming-surface text-gaming-text flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border-none md:hidden'
            aria-label='Toggle menu'
          >
            <svg
              width='20'
              height='20'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
            >
              {mobileOpen ? (
                <path d='M18 6L6 18M6 6l12 12' strokeLinecap='round' />
              ) : (
                <>
                  <line x1='3' y1='6' x2='21' y2='6' />
                  <line x1='3' y1='12' x2='21' y2='12' />
                  <line x1='3' y1='18' x2='21' y2='18' />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          'border-gaming-border overflow-hidden border-t transition-all duration-300 md:hidden',
          mobileOpen ? 'max-h-80' : 'max-h-0 border-transparent'
        )}
      >
        <div className='flex flex-col gap-1 px-4 py-3'>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={`/${lng}${link.href}`}
              onClick={() => setMobileOpen(false)}
              className='text-gaming-text-muted hover:bg-gaming-surface-light hover:text-gaming-accent rounded-lg px-4 py-3 text-sm font-medium transition-colors'
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={`/${lng}`}
            onClick={() => setMobileOpen(false)}
            className='text-gaming-text-muted hover:bg-gaming-surface-light hover:text-gaming-text mt-2 rounded-lg px-4 py-3 text-xs transition-colors'
          >
            &larr; Back to hawkstars.org
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default GamingNavbar;
