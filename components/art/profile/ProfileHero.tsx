import { Language } from '@/i18n/settings';
import { Media, ProfileLinks as ProfileLinksData } from '@/payload-types';
import { ImageMedia } from '@/payload/components/Media';
import { ArtRichText } from '../ui/ArtRichText';
import ProfileLinks from './ProfileLinks';

type ProfileHeroProps = {
  name: string;
  eyebrow?: string;
  subtitle?: string | null;
  image: string | Media | null | undefined;
  description?: Parameters<typeof ArtRichText>[0]['data'] | null;
  links?: ProfileLinksData;
  lng: Language;
};

/** Portrait + name + biography, shared by the artist and curator profile pages. */
export default function ProfileHero({
  name,
  eyebrow,
  subtitle,
  image,
  description,
  links,
  lng,
}: ProfileHeroProps) {
  return (
    <section className='art-spotlight px-4 pt-16 pb-16 lg:px-8 lg:pt-20'>
      <div className='mx-auto grid max-w-6xl items-start gap-10 md:grid-cols-[18rem_1fr] lg:gap-16'>
        <div className='border-art-line bg-art-wall border p-3 shadow-2xl shadow-black/60'>
          <ImageMedia
            resource={image}
            alt={name}
            width={288}
            height={384}
            preload
            className='aspect-3/4 w-full object-cover grayscale'
          />
        </div>
        <div className='flex flex-col gap-4'>
          {eyebrow && <p className='art-eyebrow'>{eyebrow}</p>}
          <h1 className='art-display'>{name}</h1>
          {subtitle && (
            <p className='text-art-text-2 text-sm tracking-wider uppercase'>{subtitle}</p>
          )}
          {description && <ArtRichText data={description} className='mt-4 text-lg' lng={lng} />}
          {links && <ProfileLinks links={links} lng={lng} />}
        </div>
      </div>
    </section>
  );
}
