import Link from 'next/link';
import { SocialIcon, SocialType } from '../../utils/models/social';

import { Partner } from '@/payload-types';
import { ImageMedia } from '@/payload/components/Media';
import { getServerTranslation } from '@/i18n';
import { Language, fallbackLng } from '@/i18n/settings';
import { getInitials } from '@/lib/initials';

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

type PartnerCardProps = Partner & {
  lng?: Language;
  /** h4 when the card sits under a country heading. */
  headingLevel?: 'h3' | 'h4';
};

const PartnerCard = async (partner: PartnerCardProps) => {
  const { name, logo, links, lng = fallbackLng, headingLevel: Heading = 'h3' } = partner;
  const { t } = await getServerTranslation(lng, 'partners');

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
            {getInitials(name)}
          </span>
        )}
      </div>

      {/* Country is shown once per group heading on the partners page, not per card. */}
      <Heading className='text-body_semibold mt-auto leading-snug text-balance'>{name}</Heading>

      <PartnerLinks links={links} lng={lng} />
    </div>
  );
};

export default PartnerCard;
