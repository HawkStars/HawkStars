import type { IconType } from 'react-icons';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTiktok, FaYoutube } from 'react-icons/fa6';
import { LuGlobe, LuLink, LuNotebookPen } from 'react-icons/lu';
import { Language } from '@/i18n/settings';
import { ProfileLinks as ProfileLinksData } from '@/payload-types';
import {
  PROFILE_LINK_PLATFORMS,
  ProfileLinkPlatform,
} from '@/payload/collections/Artist/profileLinkPlatforms';
import { Button } from '@/components/ui/button';

const PLATFORM_ICONS: Record<ProfileLinkPlatform, IconType> = {
  website: LuGlobe,
  blog: LuNotebookPen,
  instagram: FaInstagram,
  facebook: FaFacebookF,
  linkedin: FaLinkedinIn,
  youtube: FaYoutube,
  tiktok: FaTiktok,
  other: LuLink,
};

/** The artist's / curator's social networks, website and blog as buttons. */
export default function ProfileLinks({ links, lng }: { links: ProfileLinksData; lng: Language }) {
  if (!links?.length) return null;

  return (
    <ul className='mt-6 flex flex-wrap gap-3'>
      {links.map((link) => {
        const Icon = PLATFORM_ICONS[link.platform];
        const label =
          link.title ||
          PROFILE_LINK_PLATFORMS.find((platform) => platform.value === link.platform)?.label[lng];

        return (
          <li key={link.id ?? link.url}>
            <Button asChild variant='art-outline' size='art'>
              <a href={link.url} target='_blank' rel='noopener noreferrer'>
                <Icon aria-hidden />
                {label}
              </a>
            </Button>
          </li>
        );
      })}
    </ul>
  );
}
