import Link from 'next/link';
import { LuArrowRight } from 'react-icons/lu';
import { getServerTranslation } from '@/i18n';
import { Language } from '@/i18n/settings';
import { Curator } from '@/payload-types';
import { ImageMedia } from '@/payload/components/Media';
import { Button } from '@/components/ui/button';
import { SectionHeader } from '../ui';
import { curatorUrl, richTextToPlain } from '../artwork/helpers';

/**
 * Overview of the curators on the gallery home page: photo, role and a short
 * biography. Their curated artworks are only listed on each curator's profile.
 */
export default async function CuratorsSection({
  curators,
  lng,
}: {
  curators: Curator[];
  lng: Language;
}) {
  if (curators.length === 0) return null;
  const { t } = await getServerTranslation(lng, 'art');

  return (
    <section className='bg-art-charcoal border-art-line border-t px-4 py-20 lg:px-8 lg:py-28'>
      <div className='mx-auto max-w-7xl'>
        <SectionHeader eyebrow={t('home.curators_eyebrow')} title={t('home.curators_title')} />
        <div className='mt-12 grid gap-8 lg:grid-cols-2'>
          {curators.map((curator) => (
            <article key={curator.id} className='art-panel flex flex-col p-6 md:p-8'>
              <div className='flex flex-col gap-6 sm:flex-row'>
                <ImageMedia
                  resource={curator.image}
                  alt={curator.name}
                  width={160}
                  height={208}
                  className='border-art-line aspect-3/4 w-32 shrink-0 border object-cover grayscale sm:w-40'
                />
                <div className='flex flex-col gap-3'>
                  <span className='border-art-gold/50 text-art-gold-bright w-fit border px-2 py-0.5 text-[10px] tracking-wider uppercase'>
                    {t('home.curator_badge')}
                  </span>
                  <h3 className='font-art-serif text-art-text text-3xl'>{curator.name}</h3>
                  {curator.role && (
                    <p className='art-eyebrow text-art-brass text-[10px]'>{curator.role}</p>
                  )}
                  <p className='text-art-text-2 leading-relaxed'>
                    {richTextToPlain(curator.description, 320)}
                  </p>
                </div>
              </div>

              <Button asChild variant='art-ghost' size='art' className='mt-6 self-start'>
                <Link href={curatorUrl(lng, curator)}>
                  {t('home.see_profile')}
                  <LuArrowRight aria-hidden />
                </Link>
              </Button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
