import TwitterIcon from '@/public/images/icons/socials/twitter.svg';
import WebsiteIcon from '@/public/images/icons/socials/website.svg';
import FacebookIcon from '@/public/images/icons/socials/facebook.svg';
import InstagramIcon from '@/public/images/icons/socials/instagram.svg';
import LinkedinIcon from '@/public/images/icons/socials/linkedin.svg';

export type SocialType = 'facebook' | 'instagram' | 'twitter' | 'website' | 'linkedin';

export const SocialIcon = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  twitter: TwitterIcon,
  website: WebsiteIcon,
  linkedin: LinkedinIcon,
} as { [x in SocialType]: string };
