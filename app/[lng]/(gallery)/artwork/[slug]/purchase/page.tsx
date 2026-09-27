import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LuArrowLeft, LuMessageCircleQuestion, LuShieldCheck } from 'react-icons/lu';
import { getServerTranslation } from '@/i18n';
import { LanguageProps } from '@/components/types';
import { Artist } from '@/payload-types';
import { getGallerySettings, getSingleArtwork } from '@/lib/payload/queries/artwork';
import { artworkPrice, computeArtworkTotals, isPurchasable } from '@/lib/art-gallery/pricing';
import { ImageMedia } from '@/payload/components/Media';
import { formatDimensions } from '@/lib/art-gallery/dimensions';
import { Button } from '@/components/ui/button';
import PurchaseForm from '@/components/art/purchase/PurchaseForm';
import QuestionForm from '@/components/art/forms/QuestionForm';
import { Placard } from '@/components/art/ui';
import {
  artworkImage,
  artworkUrl,
  editionLabel,
  populated,
} from '@/components/art/artwork/helpers';

type PurchasePageProps = { params: Promise<LanguageProps & { slug: string }> };

// A checkout step: never indexed.
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function PurchasePage(props: PurchasePageProps) {
  const { lng, slug } = await props.params;
  const [artwork, settings, { t }] = await Promise.all([
    getSingleArtwork(slug, lng),
    getGallerySettings(lng),
    getServerTranslation(lng, 'art'),
  ]);
  if (!artwork) notFound();

  const backUrl = artworkUrl(lng, artwork);

  if (!isPurchasable(artwork)) {
    return (
      <section className='art-spotlight flex min-h-[50vh] flex-col items-center justify-center gap-6 px-4 text-center'>
        <h1 className='art-heading'>{t('purchase.unavailable')}</h1>
        <Button asChild variant='art-outline' size='art'>
          <Link href={backUrl}>{t('purchase.unavailable_cta')}</Link>
        </Button>
      </section>
    );
  }

  const artist = populated<Artist>(artwork.artist);
  const image = artworkImage(artwork);
  const totals = computeArtworkTotals(artworkPrice(artwork)!, settings.vat_rate);

  const artworkSummary = (
    <section className='art-panel flex flex-col gap-6 p-6 sm:flex-row md:p-8'>
      <div className='flex w-full shrink-0 flex-col items-center gap-3 sm:w-44'>
        <div className='bg-art-ebony border-art-brass/60 relative aspect-4/5 w-full border-2'>
          <ImageMedia
            resource={image}
            alt={artwork.title}
            fill
            sizes='176px'
            className='object-cover'
          />
        </div>
        <p className='art-eyebrow text-art-brass text-center text-[10px]'>
          {editionLabel(artwork, t)}
        </p>
      </div>
      <div className='flex flex-1 flex-col gap-2'>
        <div className='flex flex-wrap items-start justify-between gap-2'>
          {artist && <p className='art-eyebrow text-art-text-2 text-[10px]'>{artist.name}</p>}
          {artwork.reference && <Placard className='font-mono'>#{artwork.reference}</Placard>}
        </div>
        <h2 className='font-art-serif text-art-text text-2xl italic'>{artwork.title}</h2>
        <dl className='mt-2 flex flex-col gap-1 text-sm'>
          {[
            [t('artwork.technique'), artwork.technique],
            [t('artwork.dimensions'), formatDimensions(artwork, lng)],
            [t('artwork.year'), artwork.year],
          ]
            .filter(([, value]) => value)
            .map(([label, value]) => (
              <div key={String(label)} className='flex gap-2'>
                <dt className='text-art-muted'>{label}:</dt>
                <dd className='text-art-text'>{value}</dd>
              </div>
            ))}
        </dl>
        <div className='border-art-line mt-auto flex flex-wrap items-center justify-between gap-2 border-t pt-3 text-xs'>
          <p className='text-art-gold-bright flex items-center gap-2'>
            <span aria-hidden className='bg-art-gold h-1.5 w-1.5 rounded-full' />
            {(artwork.edition_size ?? 1) > 1
              ? t('artwork.available', { count: artwork.available_quantity ?? 0 })
              : editionLabel(artwork, t)}
          </p>
          <p className='text-art-muted'>{t('purchase.availability')}</p>
        </div>
      </div>
    </section>
  );

  const questionPanel = (
    <section className='art-panel p-6 md:p-8'>
      <div className='border-art-line flex items-center justify-between gap-3 border-b pb-4'>
        <h2 className='font-art-serif text-art-text flex items-center gap-3 text-xl'>
          <LuMessageCircleQuestion aria-hidden className='text-art-gold' />
          {t('question.title')}
        </h2>
        <span aria-hidden className='bg-art-gold-bright h-2 w-2 rounded-full' />
      </div>
      <p className='art-justify text-art-text-2 mt-4 mb-6 text-sm'>{t('question.text')}</p>
      <QuestionForm
        artworkTitle={artwork.title}
        artworkReference={artwork.reference ?? ''}
        contactEmail={settings.contact_email}
        contactPhone={settings.contact_phone}
      />
    </section>
  );

  return (
    <div className='px-4 py-10 lg:px-8 lg:py-14'>
      <div className='mx-auto max-w-7xl'>
        <div className='border-art-line flex flex-col gap-4 border-b pb-8 md:flex-row md:items-end md:justify-between'>
          <div>
            <Link
              href={backUrl}
              className='text-art-text-2 hover:text-art-gold-bright flex items-center gap-2 text-xs tracking-wider uppercase'
            >
              <LuArrowLeft aria-hidden />
              {t('purchase.back')}
            </Link>
            <h1 className='art-display mt-4 md:text-5xl'>{t('purchase.title')}</h1>
          </div>
          <p className='border-art-line text-art-gold-bright flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-xs tracking-wider uppercase'>
            <LuShieldCheck aria-hidden />
            {t('purchase.secure')}
          </p>
        </div>

        <div className='mt-10'>
          <PurchaseForm
            artworkId={artwork.id}
            totals={totals}
            impactShare={settings.social_impact_share}
            artworkSummary={artworkSummary}
            aside={questionPanel}
          />
        </div>
      </div>
    </div>
  );
}
