import { IconType } from 'react-icons';
import {
  PiFacebookLogoBold,
  PiLinkedinLogoBold,
  PiTwitterLogoBold,
  PiGlobeSimpleBold,
  PiInstagramLogoBold,
} from 'react-icons/pi';

export type SocialContact = {
  type: 'facebook' | 'instagram' | 'twitter' | 'website' | 'linkedin';
  url: string;
};

export type SocialType =
  | 'facebook'
  | 'instagram'
  | 'twitter'
  | 'website'
  | 'linkedin';

export const SocialIcon = {
  facebook: PiFacebookLogoBold,
  instagram: PiInstagramLogoBold,
  twitter: PiTwitterLogoBold,
  website: PiGlobeSimpleBold,
  linkedin: PiLinkedinLogoBold,
} as { [x in SocialType]: IconType };
