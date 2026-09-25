import Link from 'next/link';
import { getServerTranslation } from '@/i18n';
import { Language } from '@/i18n/settings';
import { Button } from '@/components/ui/button';
import { SITE_GET_URLS, transformUrl } from '@/utils/paths';
import { PROPOSE_ANCHOR } from './constants';

const STEPS = [1, 2, 3] as const;

/** Home page call to action; the form itself lives on the artists page. */
export default async function ProposeSection({ lng, share }: { lng: Language; share: string }) {
  const { t } = await getServerTranslation(lng, 'art');

  return (
    <section className='art-spotlight bg-art-charcoal border-art-line border-t px-4 py-20 text-center lg:px-8 lg:py-28'>
      <div className='mx-auto max-w-5xl'>
        <p className='art-eyebrow'>{t('propose.eyebrow')}</p>
        <h2 className='art-heading mt-4 md:text-5xl'>{t('propose.title')}</h2>
        <p className='art-justify-center text-art-text-2 mx-auto mt-6 max-w-2xl text-lg'>
          {t('propose.text')}
        </p>

        <ol className='mt-12 grid gap-4 text-left md:grid-cols-3'>
          {STEPS.map((step) => (
            <li key={step} className='border-art-line bg-art-ebony border p-6'>
              <p className='font-art-serif text-art-gold-bright text-2xl'>{`0${step}.`}</p>
              <p className='text-art-text mt-3 font-semibold'>{t(`propose.step_${step}_title`)}</p>
              <p className='art-justify text-art-muted mt-2 text-sm'>
                {t(`propose.step_${step}_text`, { share })}
              </p>
            </li>
          ))}
        </ol>

        <Button asChild variant='art' size='art' className='mt-10'>
          <Link href={`${transformUrl(lng, SITE_GET_URLS.artists)}#${PROPOSE_ANCHOR}`}>
            {t('propose.cta')}
          </Link>
        </Button>
      </div>
    </section>
  );
}
