import { LuFileText } from 'react-icons/lu';
import { getServerTranslation } from '@/i18n';
import { Language } from '@/i18n/settings';
import { Artwork } from '@/payload-types';
import { getArtCategoryLabel } from '@/payload/collections/ArtCollection/categories';
import { artworkPrice, formatEuro } from '@/lib/art-gallery/pricing';
import { euroAmountInWords } from '@/lib/art-gallery/numberToWords';
import { formatDimensions } from '@/lib/art-gallery/dimensions';

/** "Ficha Técnica Curatorial" — every field that has a value, then the acquisition price. */
export default async function ArtworkSpecs({ artwork, lng }: { artwork: Artwork; lng: Language }) {
  const { t } = await getServerTranslation(lng, 'art');
  const price = artworkPrice(artwork);

  const specs = [
    { label: t('artwork.year'), value: artwork.year },
    { label: t('artwork.category'), value: getArtCategoryLabel(artwork.category, lng) },
    { label: t('artwork.technique'), value: artwork.technique, wide: true },
    { label: t('artwork.dimensions'), value: formatDimensions(artwork, lng) },
    {
      label: t('artwork.tiragem'),
      value:
        (artwork.edition_size ?? 1) <= 1
          ? t('edition.unique')
          : t('artwork.edition_size', { count: artwork.edition_size ?? 1 }),
    },
    {
      label: t('artwork.editions_remaining'),
      value: (artwork.edition_size ?? 1) > 1 ? String(artwork.available_quantity ?? 0) : null,
    },
    { label: t('artwork.edition_notes'), value: artwork.tiragem, wide: true },
  ].filter((spec) => spec.value);

  return (
    <section className='art-panel p-6 md:p-8'>
      <div className='border-art-line flex items-center justify-between gap-4 border-b pb-5'>
        <h2 className='font-art-serif text-art-text flex items-center gap-3 text-2xl'>
          <LuFileText aria-hidden className='text-art-gold text-lg' />
          {t('artwork.specs_title')}
        </h2>
        {artwork.reference && (
          <p className='art-eyebrow text-art-brass text-[10px]'>
            {t('artwork.certificate', { ref: artwork.reference })}
          </p>
        )}
      </div>

      {specs.length > 0 && (
        <dl className='border-art-line grid gap-x-8 gap-y-5 border-b py-6 sm:grid-cols-2'>
          {specs.map((spec) => (
            <div key={spec.label} className={spec.wide ? 'sm:col-span-2' : undefined}>
              <dt className='art-eyebrow text-art-muted text-[10px]'>{spec.label}</dt>
              <dd className='text-art-text mt-1'>{spec.value}</dd>
            </div>
          ))}
        </dl>
      )}

      <div className='pt-6'>
        <div className='flex items-center justify-between gap-4'>
          <p className='art-eyebrow text-art-muted text-[10px]'>{t('artwork.price')}</p>
          <p className='art-eyebrow text-art-terracotta text-[10px]'>{t('artwork.transparency')}</p>
        </div>
        {artwork.is_sold ? (
          <p className='font-art-serif text-art-terracotta mt-3 text-3xl'>{t('artwork.sold')}</p>
        ) : price ? (
          <p className='mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-1'>
            <span className='font-art-serif text-art-gold-bright text-5xl'>
              {formatEuro(price, lng, 0)}
            </span>
            <span className='text-art-text-2 text-sm'>{t('artwork.plus_vat')}</span>
            <span className='text-art-muted text-sm'>({euroAmountInWords(price, lng)})</span>
          </p>
        ) : (
          <p className='font-art-serif text-art-text mt-3 text-2xl'>
            {t('artwork.price_on_request')}
          </p>
        )}
      </div>
    </section>
  );
}
