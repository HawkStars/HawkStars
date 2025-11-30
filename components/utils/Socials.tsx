import Link from 'next/link';
import Image from 'next/image';

import MailIcon from '@/public/images/icons/common/mail.svg';

import FacebookIcon from '@/public/images/icons/socials/facebook.svg';
import InstagramIcon from '@/public/images/icons/socials/instagram.svg';
import LinkedinIcon from '@/public/images/icons/socials/linkedin.svg';
import YoutubeIcon from '@/public/images/icons/socials/youtube.svg';

const Icons = [
  {
    icon: YoutubeIcon,
    href: 'https://www.youtube.com/@HawkStarsNGO',
    label: 'Check HawkStars NGO on Youtube',
    openInNewTab: true,
  },
  {
    icon: InstagramIcon,
    href: 'https://www.instagram.com/hawk.starsngo',
    label: 'Check HawkStars NGO on Instagram',
    openInNewTab: true,
  },
  {
    icon: FacebookIcon,
    href: 'https://www.facebook.com/hawkstarsngo',
    label: 'Check HawkStars NGO on Facebook',
    openInNewTab: true,
  },
  {
    icon: LinkedinIcon,
    href: 'https://www.linkedin.com/company/hawkstars-ngo',
    label: 'Check HawkStars NGO on Linkedin',
    openInNewTab: true,
  },
  {
    icon: MailIcon,
    href: 'mailto:hawkstarsngo@gmail.com',
    label: 'Click to send an email to HawkStars NGO',
    openInNewTab: false,
  },
] as const;

const Socials = () => {
  return (
    <div className='flex gap-1'>
      {Icons.map(({ icon, href, label, openInNewTab }, index) => (
        <Link
          key={index}
          target={openInNewTab ? '_blank' : undefined}
          href={href}
          aria-label={label}
        >
          <Image
            src={icon}
            alt={label}
            width={24}
            height={24}
            className={openInNewTab ? 'grayscale hover:grayscale-0' : undefined}
            style={{ transition: openInNewTab ? 'filter 0.3s ease' : undefined }}
          />
        </Link>
      ))}
    </div>
  );
};

export default Socials;
