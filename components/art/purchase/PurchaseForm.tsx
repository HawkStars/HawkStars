'use client';

import { useRouter } from 'next/navigation';
import { ReactNode, useId, useState } from 'react';
import { SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { LuClipboardCheck, LuFileCheck, LuLock, LuShieldCheck } from 'react-icons/lu';
import { useTranslation } from '@/i18n/client';
import { useLanguageCookie } from '@/utils/contexts/AppProvider';
import { ArtworkTotals, formatEuro } from '@/lib/art-gallery/pricing';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArtInput } from '../ui/ArtField';
import { EMAIL_PATTERN } from '../forms/utils';

type Delivery = 'pickup' | 'carrier';
type PaymentType = 'MB' | 'MBW' | 'CC';

type PurchaseInput = {
  delivery: Delivery;
  paymentType: PaymentType;
  name: string;
  nif: string;
  email: string;
  phone_indicative: string;
  phone_number: string;
  address: string;
  postal_code_city: string;
};

type PurchaseFormProps = {
  artworkId: string;
  totals: ArtworkTotals;
  /** Informative text such as "30–40%" — never used in calculations. */
  impactShare: string;
  /** Artwork summary card, rendered at the top of the left column. */
  artworkSummary: ReactNode;
  /** Rendered under the order summary (the question panel). */
  aside: ReactNode;
};

const DELIVERIES: Delivery[] = ['pickup', 'carrier'];
const PAYMENT_TYPES: { value: PaymentType; label: string }[] = [
  { value: 'MB', label: 'purchase.mb' },
  { value: 'MBW', label: 'purchase.mbw' },
  { value: 'CC', label: 'purchase.cc' },
];

export default function PurchaseForm({
  artworkId,
  totals,
  impactShare,
  artworkSummary,
  aside,
}: PurchaseFormProps) {
  const lng = useLanguageCookie();
  const { t } = useTranslation(lng, 'art');
  const formId = useId();
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<PurchaseInput>({
    defaultValues: { delivery: 'pickup', paymentType: 'MB', phone_indicative: '+351' },
  });
  const delivery = useWatch({ control, name: 'delivery' });
  const paymentType = useWatch({ control, name: 'paymentType' });

  const onSubmit: SubmitHandler<PurchaseInput> = async (values) => {
    setSubmitError(null);
    try {
      const response = await fetch('/api/art-gallery/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, artworkId, lng, nif: values.nif || undefined }),
      });
      const data = await response.json();
      if (!response.ok) {
        setSubmitError(
          data.error === 'unavailable'
            ? t('purchase.errors.unavailable')
            : t('purchase.errors.generic')
        );
        return;
      }
      // The order page shows the payment instructions and follows the payment.
      router.push(data.orderUrl);
    } catch {
      setSubmitError(t('purchase.errors.generic'));
    }
  };

  const required = t('purchase.errors.required');

  return (
    // The question panel (`aside`) is its own <form>, so it can't live inside
    // this one: the summary column sits outside and submits via `form={formId}`.
    <div className='grid items-start gap-8 lg:grid-cols-[1.4fr_1fr]'>
      <form
        id={formId}
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className='flex flex-col gap-8'
      >
        {artworkSummary}

        <section className='border-art-terracotta/40 bg-art-terracotta/5 flex gap-4 border p-6'>
          <span className='bg-art-terracotta/15 text-art-terracotta h-fit shrink-0 rounded-full px-3 py-1.5 text-sm font-semibold whitespace-nowrap'>
            {impactShare}
          </span>
          <div className='flex-1'>
            <p className='flex flex-wrap items-center gap-3'>
              <span className='art-eyebrow text-art-terracotta text-[10px]'>
                {t('purchase.impact_eyebrow')}
              </span>
              <span className='bg-art-terracotta/15 text-art-terracotta rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase'>
                {t('purchase.impact_badge', { share: impactShare })}
              </span>
            </p>
            <p className='art-justify text-art-text-2 border-art-line mt-3 border-b pb-4 text-lg leading-relaxed'>
              {t('purchase.impact', { share: impactShare })}
            </p>
          </div>
        </section>

        <fieldset className='art-panel p-6 md:p-8'>
          <legend className='sr-only'>{t('purchase.delivery_title')}</legend>
          <h2 className='font-art-serif text-art-text text-2xl' aria-hidden>
            {t('purchase.delivery_title')}
          </h2>
          <p className='text-art-text-2 mt-1'>{t('purchase.delivery_text')}</p>
          <div className='mt-6 flex flex-col gap-4'>
            {DELIVERIES.map((option) => (
              <label
                key={option}
                className={cn(
                  'flex cursor-pointer gap-4 border p-5 transition-colors',
                  delivery === option
                    ? 'border-art-gold-bright bg-art-gold-bright/5'
                    : 'border-art-line hover:border-art-gold/50'
                )}
              >
                <input
                  type='radio'
                  value={option}
                  className='accent-art-gold-bright mt-1.5'
                  {...register('delivery')}
                />
                <span className='flex flex-1 flex-col gap-1'>
                  <span className='flex flex-wrap items-baseline justify-between gap-2'>
                    <span className='font-art-serif text-art-text text-lg'>
                      {t(`purchase.${option}`)}
                    </span>
                    <span className='text-art-gold-bright text-xs tracking-wider uppercase'>
                      {option === 'pickup'
                        ? t('purchase.shipping_free')
                        : t('purchase.shipping_later')}
                    </span>
                  </span>
                  <span className='art-justify text-art-muted text-sm'>
                    {t(`purchase.${option}_note`)}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className='art-panel p-6 md:p-8'>
          <legend className='sr-only'>{t('purchase.buyer_title')}</legend>
          <h2 className='font-art-serif text-art-text text-2xl' aria-hidden>
            {t('purchase.buyer_title')}
          </h2>
          <p className='art-justify text-art-muted mt-1 text-sm'>{t('purchase.buyer_text')}</p>
          <div className='border-art-line mt-6 grid gap-5 border-t pt-6 sm:grid-cols-2'>
            <ArtInput
              label={`${t('purchase.name')} *`}
              autoComplete='name'
              error={errors.name && required}
              {...register('name', { required: true, maxLength: 120 })}
            />
            <ArtInput
              label={t('purchase.nif')}
              inputMode='numeric'
              {...register('nif', { maxLength: 20 })}
            />
            <ArtInput
              label={`${t('purchase.address')} *`}
              autoComplete='street-address'
              error={errors.address && required}
              {...register('address', { required: true, maxLength: 200 })}
            />
            <ArtInput
              label={`${t('purchase.postal_code_city')} *`}
              autoComplete='postal-code'
              error={errors.postal_code_city && required}
              {...register('postal_code_city', { required: true, maxLength: 120 })}
            />
            <div className='flex gap-2'>
              <ArtInput
                label='+'
                wrapperClassName='w-24'
                autoComplete='tel-country-code'
                {...register('phone_indicative', { maxLength: 6 })}
              />
              <ArtInput
                label={`${t('purchase.phone')}${paymentType === 'MBW' ? ' *' : ''}`}
                wrapperClassName='flex-1'
                type='tel'
                autoComplete='tel-national'
                error={errors.phone_number && t('purchase.errors.phone_required')}
                {...register('phone_number', { required: paymentType === 'MBW', maxLength: 20 })}
              />
            </div>
            <ArtInput
              label={`${t('purchase.email')} *`}
              type='email'
              autoComplete='email'
              error={errors.email && required}
              {...register('email', { required: true, pattern: EMAIL_PATTERN })}
            />
          </div>
        </fieldset>

        <fieldset className='art-panel p-6 md:p-8'>
          <legend className='sr-only'>{t('purchase.payment_title')}</legend>
          <h2 className='font-art-serif text-art-text text-2xl' aria-hidden>
            {t('purchase.payment_title')}
          </h2>
          <div className='mt-6 grid gap-3 sm:grid-cols-3'>
            {PAYMENT_TYPES.map(({ value, label }) => (
              <label
                key={value}
                className={cn(
                  'flex cursor-pointer items-center gap-3 border p-4 transition-colors',
                  paymentType === value
                    ? 'border-art-gold-bright bg-art-gold-bright/5'
                    : 'border-art-line hover:border-art-gold/50'
                )}
              >
                <input
                  type='radio'
                  value={value}
                  className='accent-art-gold-bright'
                  {...register('paymentType')}
                />
                <span className='text-art-text text-sm'>{t(label)}</span>
              </label>
            ))}
          </div>
          {paymentType === 'MBW' && (
            <p className='text-art-muted mt-3 text-sm'>{t('purchase.mbw_note')}</p>
          )}
        </fieldset>
      </form>

      <div className='flex flex-col gap-8 lg:sticky lg:top-28'>
        <section className='art-panel p-6 md:p-8'>
          <div className='flex items-center justify-between gap-4'>
            <h2 className='font-art-serif text-art-text text-2xl'>{t('purchase.summary_title')}</h2>
            <span className='border-art-gold/50 text-art-gold-bright border px-2.5 py-1 text-[10px] tracking-wider uppercase'>
              {t('purchase.summary_badge')}
            </span>
          </div>
          <dl className='mt-6 flex flex-col gap-4 text-sm'>
            <SummaryRow label={t('purchase.base')} value={formatEuro(totals.base, lng)} />
            <SummaryRow
              label={t('purchase.vat', { rate: totals.vatRate })}
              value={formatEuro(totals.vat, lng)}
            />
            <SummaryRow
              label={t('purchase.shipping')}
              value={delivery === 'pickup' ? formatEuro(0, lng) : t('purchase.shipping_later')}
              note={
                delivery === 'carrier' ? t('purchase.carrier_short') : t('purchase.pickup_short')
              }
            />
          </dl>
          <div className='border-art-line mt-6 flex items-end justify-between gap-4 border-t pt-6'>
            <div>
              <p className='font-art-serif text-art-text text-xl'>{t('purchase.total')}</p>
              <p className='text-art-muted text-xs'>{t('purchase.total_note')}</p>
            </div>
            <p className='text-art-gold-bright font-mono text-3xl'>
              {formatEuro(totals.total, lng)}
            </p>
          </div>

          <ul className='border-art-line text-art-muted mt-6 flex flex-col gap-2 border-t pt-5 text-xs'>
            <li className='flex items-start gap-2'>
              <LuLock aria-hidden className='mt-0.5 shrink-0' />
              {t('purchase.guarantee_reservation')}
            </li>
            <li className='flex items-start gap-2'>
              <LuFileCheck aria-hidden className='mt-0.5 shrink-0' />
              {t('purchase.guarantee_certificate')}
            </li>
          </ul>

          {submitError && (
            <p role='alert' className='text-art-terracotta mt-6 text-sm'>
              {submitError}
            </p>
          )}
          <Button
            type='submit'
            form={formId}
            variant='art'
            size='art'
            className='mt-6 w-full'
            disabled={isSubmitting}
          >
            <LuClipboardCheck aria-hidden />
            {isSubmitting ? t('purchase.processing') : t('purchase.confirm')}
          </Button>
          <p className='text-art-muted mt-3 flex items-start gap-2 text-xs'>
            <LuShieldCheck aria-hidden className='mt-0.5 shrink-0' />
            {t('purchase.confirm_note')}
          </p>
        </section>

        {aside}
      </div>
    </div>
  );
}

function SummaryRow({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className='flex items-start justify-between gap-4'>
      <dt className='text-art-text-2'>
        {label}
        {note && <span className='text-art-muted block text-xs'>{note}</span>}
      </dt>
      <dd className='text-art-text font-mono'>{value}</dd>
    </div>
  );
}
