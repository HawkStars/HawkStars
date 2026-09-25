import Link from 'next/link';
import { LuLock } from 'react-icons/lu';
import { getServerTranslation } from '@/i18n';
import { Language } from '@/i18n/settings';
import { Artwork } from '@/payload-types';
import { GallerySettings } from '@/lib/payload/queries/artwork';
import { isPurchasable } from '@/lib/art-gallery/pricing';
import { Button } from '@/components/ui/button';
import QuestionDialog from '../forms/QuestionDialog';
import { artworkUrl } from './helpers';

type AcquisitionPanelProps = { artwork: Artwork; lng: Language; settings: GallerySettings };

/** "Mecanismo de Aquisição Direta": the social impact manifesto and the buy / ask buttons. */
export default async function AcquisitionPanel({ artwork, lng, settings }: AcquisitionPanelProps) {
  const { t } = await getServerTranslation(lng, 'art');
  const purchasable = isPurchasable(artwork);
  const reference = artwork.reference ?? '';

  return (
    <section className='art-panel p-6 md:p-8'>
      <p className='art-eyebrow'>{t('artwork.acquisition_eyebrow')}</p>
      <h2 className='font-art-serif text-art-text border-art-line mt-2 border-b pb-5 text-2xl'>
        {t('artwork.acquisition_title')}
      </h2>

      {!artwork.is_sold && (
        <div className='border-art-terracotta/60 bg-art-terracotta/5 mt-6 flex flex-col gap-3 border p-5 sm:flex-row sm:items-start'>
          <span className='border-art-terracotta/60 font-art-serif text-art-terracotta w-fit shrink-0 rounded-full border px-3 py-1.5 text-sm whitespace-nowrap italic'>
            {settings.social_impact_share}
          </span>
          <div>
            <p className='font-art-serif text-art-text text-lg'>{t('artwork.impact_title')}</p>
            <p className='art-justify text-art-text-2 mt-1 text-sm'>
              {t('artwork.impact_text', { share: settings.social_impact_share })}
            </p>
          </div>
        </div>
      )}

      {artwork.is_sold && (
        <p className='art-justify text-art-text-2 mt-6 text-sm'>{t('artwork.sold_note')}</p>
      )}

      <div className='mt-6 flex flex-col gap-3'>
        {purchasable && (
          <Button asChild variant='art' size='art' className='w-full'>
            <Link href={`${artworkUrl(lng, artwork)}/purchase`}>
              <LuLock aria-hidden />
              {t('artwork.buy')}
            </Link>
          </Button>
        )}
        <QuestionDialog
          triggerLabel={[t('artwork.ask'), reference && t('artwork.ask_ref', { ref: reference })]
            .filter(Boolean)
            .join(' ')}
          title={t('question.title')}
          description={t('question.text')}
          artworkTitle={artwork.title}
          artworkReference={reference}
          contactEmail={settings.contact_email}
          contactPhone={settings.contact_phone}
        />
      </div>
    </section>
  );
}
