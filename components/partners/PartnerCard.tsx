import Link from 'next/link';
import { SocialIcon, SocialType } from '../../utils/models/social';

import { Partner } from '@/payload-types';
import { FlagIcons } from '@/lib/flags';
import { ImageMedia } from '@/payload/components/Media';
import { getServerTranslation } from '@/i18n';
import { Language, fallbackLng } from '@/i18n/settings';
import { getPartnerInitials } from './utils';

type PartnerLinksProps = Pick<Partner, 'links'> & { lng: Language };

const PartnerLinks = async ({ links, lng }: PartnerLinksProps) => {
  const { t } = await getServerTranslation(lng, 'partners');
  if (!links || links.length === 0) return null;

  return (
    <div className='flex justify-center gap-2'>
      {links.map((link, index) => {
        const icon = link && SocialIcon[link.platform as SocialType];

        return (
          <Link
            key={index}
            href={link.url}
            target='_blank'
            rel='noopener noreferrer'
            className='opacity-70 transition-opacity hover:opacity-100'
          >
            {icon && (
              <ImageMedia
                src={icon}
                alt={t('a11y.platformIcon', { platform: link.platform })}
                width={22}
                height={22}
              />
            )}
          </Link>
        );
      })}
    </div>
  );
};

const PartnerCard = async (partner: Partner & { lng?: Language }) => {
  const { name, logo, country, links, type, lng = fallbackLng } = partner;
  const { t } = await getServerTranslation(lng, 'partners');

  // National partners are all Portuguese, so a flag on each says nothing;
  // it only distinguishes international ones.
  const flagIcon = type === 'international' && country ? FlagIcons[country] : undefined;
  const logoUrl = logo && typeof logo === 'object' ? logo.url : undefined;

  return (
    <div className='card card-hover border-bege-dark group flex h-full flex-col items-center gap-4 border p-5 text-center'>
      {/* Logo area is a fixed height so a row of cards lines up with or without logos */}
      <div className='flex h-24 w-full items-center justify-center'>
        {logoUrl ? (
          <ImageMedia
            src={logoUrl}
            alt={t('a11y.logoAlt', { name })}
            width={160}
            height={96}
            sizes='160px'
            className='max-h-24 w-auto object-contain grayscale transition duration-300 group-hover:grayscale-0'
          />
        ) : (
          <span
            aria-hidden='true'
            className='bg-bege-dark text-green font-display flex size-20 items-center justify-center rounded-full text-2xl font-semibold'
          >
            {getPartnerInitials(name)}
          </span>
        )}
      </div>

      <h3 className='text-body_semibold mt-auto leading-snug text-balance'>{name}</h3>

      {flagIcon && (
        <span className='text-muted-foreground flex items-center gap-1.5 text-xs'>
          {flagIcon({ title: country, className: 'w-5 rounded-xs' })}
          {country}
        </span>
      )}

      <PartnerLinks links={links} lng={lng} />
    </div>
  );
};

export default PartnerCard;
