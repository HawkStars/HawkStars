'use client';
import { useTranslation } from '@/i18n/client';
import { useLanguageCookie } from '@/utils/contexts/AppProvider';
import { type JSX } from 'react';
import Accordion from '../utils/Accordion/Accordion';
import { Contribution } from '@/payload-types';
import { Button } from '@/components/ui/button';

type ChairsSectionsProps = {
  title: string;
  price?: string;
  /** Illustration of this chair type. */
  icon: JSX.Element;
  size: number;
  currentContributions: Contribution[];
};

/**
 * One chair type in the naming campaign: what it is, what it costs, how many are taken
 * and who named them. Replaces a row of one icon per seat (up to 110), whose donor
 * names only appeared on hover and so never on touch screens.
 */
const ChairsSections = ({
  title,
  price,
  icon,
  size,
  currentContributions = [],
}: ChairsSectionsProps) => {
  const lng = useLanguageCookie();
  const { t } = useTranslation(lng, 'contribute');

  const taken = Math.min(currentContributions.length, size);
  const percent = size > 0 ? Math.round((taken / size) * 100) : 0;
  // Anonymous donors are counted but not listed.
  const named = currentContributions.filter((contribution) => contribution.donor);

  return (
    <div className='card border-bege-dark flex flex-col gap-5 border p-6'>
      <div className='flex items-start gap-4'>
        <span className='bg-bege-light flex size-16 shrink-0 items-center justify-center rounded-xl p-2 [&_img]:max-h-12 [&_img]:w-auto'>
          {icon}
        </span>
        <div className='flex flex-col gap-1'>
          <h3 className='text-h3_semibold'>{title}</h3>
          {price && <span className='text-green font-display text-xl font-semibold'>{price}</span>}
        </div>
      </div>

      <div className='flex flex-col gap-2'>
        <div
          role='progressbar'
          aria-valuemin={0}
          aria-valuemax={size}
          aria-valuenow={taken}
          aria-label={title}
          className='bg-bege-dark h-2.5 overflow-hidden rounded-full'
        >
          <div className='bg-green h-full rounded-full' style={{ width: `${percent}%` }} />
        </div>
        <p className='text-sm text-black/70'>
          {t('brand.chairs.available_chairs', { taken, all: size })}
        </p>
      </div>

      {named.length > 0 && (
        <Accordion title={t('contributor')} headingLevel='h4'>
          {named.map((contribution) => (
            <div key={contribution.id} className='flex w-full justify-between gap-4 text-sm'>
              <span>{contribution.donor}</span>
              <span className='text-black/60'>{contribution.contribution_date || ''}</span>
            </div>
          ))}
        </Accordion>
      )}

      <Button asChild variant='outline' className='mt-auto self-start'>
        <a href='#form'>{t('brand.chairs.cta')}</a>
      </Button>
    </div>
  );
};

export default ChairsSections;
