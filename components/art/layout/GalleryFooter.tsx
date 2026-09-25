import Link from 'next/link';
import { cn } from '@/lib/utils';
import { getServerTranslation } from '@/i18n';
import { Language } from '@/i18n/settings';
import { SITE_GET_URLS, transformUrl } from '@/utils/paths';
import { GallerySettings } from '@/lib/payload/queries/artwork';
import { GalleryLogo } from '../ui/GalleryLogo';
import { PROPOSE_ANCHOR } from '../propose/constants';

// The crowdfunding sub-site (app/[lng]/(crowdfunding)), not in SITE_GET_URLS.
const CROWDFUNDING_PATH = '/crowdfunding';

type GalleryFooterProps = { lng: Language; settings: GallerySettings };

export default async function GalleryFooter({ lng, settings }: GalleryFooterProps) {
  const { t } = await getServerTranslation(lng, 'art');

  const galleryLinks = [
    { label: t('nav.home'), href: transformUrl(lng, SITE_GET_URLS.gallery) },
    { label: t('nav.artworks'), href: transformUrl(lng, SITE_GET_URLS.artwork) },
    { label: t('nav.artists'), href: transformUrl(lng, SITE_GET_URLS.artists) },
    { label: t('nav.news'), href: transformUrl(lng, SITE_GET_URLS.gallery_news) },
    {
      label: t('nav.propose'),
      href: `${transformUrl(lng, SITE_GET_URLS.artists)}#${PROPOSE_ANCHOR}`,
    },
  ];
  const institutionalLinks = [
    { label: t('footer.hawkstars_site'), href: transformUrl(lng, SITE_GET_URLS.home) },
    { label: t('footer.transparency'), href: transformUrl(lng, SITE_GET_URLS.transparency) },
    { label: t('footer.crowdfunding'), href: transformUrl(lng, CROWDFUNDING_PATH) },
    { label: t('footer.terms'), href: transformUrl(lng, SITE_GET_URLS.terms) },
  ];

  const linkClass =
    'font-art-sans text-art-text-2 hover:text-art-gold-bright text-sm transition-colors';

  return (
    <footer className='border-art-line bg-art-ebony border-t px-4 pt-16 pb-10 lg:px-8'>
      <div className='mx-auto grid max-w-7xl gap-12 md:grid-cols-2 lg:grid-cols-4'>
        <div className='flex flex-col gap-5 lg:col-span-1'>
          <GalleryLogo
            variant='footer'
            by={t('brand.by')}
            name={t('brand.name')}
            tagline={t('brand.tagline')}
          />
          <p className='art-justify font-art-sans text-art-muted text-sm leading-relaxed'>
            {t('footer.about')}
          </p>
        </div>

        <FooterColumn title={t('footer.links_title')}>
          {galleryLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className={linkClass}>
                {link.label}
              </Link>
            </li>
          ))}
        </FooterColumn>

        <FooterColumn title={t('footer.institutional_title')}>
          {institutionalLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className={linkClass}>
                {link.label}
              </Link>
            </li>
          ))}
        </FooterColumn>

        {/* The boxed "Gabinete Curatorial" only when a location is set in the
            gallery settings; otherwise a plain contact column. */}
        <div
          className={cn(
            'flex flex-col gap-3 self-start',
            settings.office_location && 'border-art-line bg-art-wall border p-5'
          )}
        >
          <p className='art-eyebrow'>
            {settings.office_location ? t('footer.office_title') : t('footer.contact_title')}
          </p>
          {settings.office_location && (
            <p className='text-art-cream text-sm'>{settings.office_location}</p>
          )}
          <a
            href={`mailto:${settings.contact_email}`}
            className='text-art-gold-bright hover:text-art-text text-sm whitespace-nowrap'
          >
            {settings.contact_email}
          </a>
          {settings.contact_phone && (
            <a
              href={`tel:${settings.contact_phone.replace(/\s+/g, '')}`}
              className='text-art-cream text-sm'
            >
              {settings.contact_phone}
            </a>
          )}
          <p className='text-art-muted text-xs'>{t('footer.contact_note')}</p>
        </div>
      </div>

      <div className='border-art-line mx-auto mt-14 flex max-w-7xl flex-col gap-4 border-t pt-8 md:flex-row md:items-center md:justify-between'>
        <div className='font-art-sans text-art-muted flex flex-col gap-1 text-xs'>
          <p>{t('footer.rights', { year: new Date().getFullYear() })}</p>
          <p>{t('footer.credit')}</p>
        </div>
        <p className='font-art-sans text-art-muted text-xs tracking-widest uppercase'>
          {t('footer.seal')}
        </p>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className='flex flex-col gap-4'>
      <p className='art-eyebrow'>{title}</p>
      <ul className='flex flex-col gap-3'>{children}</ul>
    </div>
  );
}
