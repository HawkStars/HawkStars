'use client';

import Link from 'next/link';
import { ImageMedia } from '@/payload/components/Media';

import MailIcon from '@/public/images/icons/common/mail.svg';

import FacebookIcon from '@/public/images/icons/socials/facebook.svg';
import InstagramIcon from '@/public/images/icons/socials/instagram.svg';
import LinkedinIcon from '@/public/images/icons/socials/linkedin.svg';
import YoutubeIcon from '@/public/images/icons/socials/youtube.svg';

import { useTranslation } from '@/i18n/client';
import { useLanguageCookie } from '@/utils/contexts/AppProvider';

const Icons = [
  {
    icon: YoutubeIcon,
    href: 'https://www.youtube.com/@HawkStarsNGO',
    labelKey: 'socials.youtube',
    openInNewTab: true,
  },
  {
    icon: InstagramIcon,
    href: 'https://www.instagram.com/hawk.starsngo',
    labelKey: 'socials.instagram',
    openInNewTab: true,
  },
  {
    icon: FacebookIcon,
    href: 'https://www.facebook.com/hawkstarsngo',
    labelKey: 'socials.facebook',
    openInNewTab: true,
  },
  {
    icon: LinkedinIcon,
    href: 'https://www.linkedin.com/company/hawkstars-ngo',
    labelKey: 'socials.linkedin',
    openInNewTab: true,
  },
  {
    icon: MailIcon,
    href: 'mailto:hawkstarsngo@gmail.com',
    labelKey: 'socials.email',
    openInNewTab: false,
  },
] as const;

const Socials = () => {
  const lng = useLanguageCookie();
  const { t } = useTranslation(lng, 'common');

  return (
    <div className='flex gap-1'>
      {Icons.map(({ icon, href, labelKey, openInNewTab }, index) => {
        const label = t(labelKey);
        return (
          <Link
            key={index}
            target={openInNewTab ? '_blank' : undefined}
            rel={openInNewTab ? 'noopener noreferrer' : undefined}
            href={href}
            aria-label={label}
          >
            <ImageMedia
              src={icon}
              alt={label}
              width={24}
              height={24}
              className={
                openInNewTab
                  ? 'grayscale transition-[filter] duration-300 ease-in-out hover:grayscale-0'
                  : undefined
              }
            />
          </Link>
        );
      })}
    </div>
  );
};

export default Socials;
