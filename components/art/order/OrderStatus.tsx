'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { LuCircleCheck, LuCircleX, LuClock, LuCreditCard, LuSmartphone } from 'react-icons/lu';
import { useTranslation } from '@/i18n/client';
import { useLanguageCookie } from '@/utils/contexts/AppProvider';
import { formatEuro } from '@/lib/art-gallery/pricing';
import type { PublicArtOrder } from '@/lib/art-gallery/orders';
import { Button } from '@/components/ui/button';

const POLL_INTERVAL_MS = 5_000;

type OrderStatusProps = {
  initialOrder: PublicArtOrder;
  token: string;
  artworkUrl: string;
  catalogUrl: string;
};

/**
 * The buyer's view of their order. While it is pending, it asks the server
 * for the status every few seconds (which re-checks with EasyPay), so it turns
 * to "paid" on its own — also after a card payment made in another tab.
 */
export default function OrderStatus({
  initialOrder,
  token,
  artworkUrl,
  catalogUrl,
}: OrderStatusProps) {
  const lng = useLanguageCookie();
  const { t } = useTranslation(lng, 'art');
  const [order, setOrder] = useState(initialOrder);

  useEffect(() => {
    if (order.status !== 'pending') return;
    const id = window.setInterval(async () => {
      try {
        const response = await fetch(
          `/api/art-gallery/order/${encodeURIComponent(order.reference)}?token=${encodeURIComponent(token)}`,
          { cache: 'no-store' }
        );
        if (response.ok) setOrder(await response.json());
      } catch {
        // Offline for a moment: the next tick retries.
      }
    }, POLL_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [order.status, order.reference, token]);

  const total = formatEuro(order.total, lng);
  const reservedUntil = order.reservedUntil
    ? new Date(order.reservedUntil).toLocaleString(lng === 'en' ? 'en-GB' : 'pt-PT', {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : null;

  if (order.status === 'paid') {
    return (
      <StatusPanel
        icon={<LuCircleCheck className='text-art-gold-bright h-14 w-14' />}
        title={t('order.paid_title')}
      >
        <p className='art-justify-center text-art-text-2'>
          {t('order.paid_text', { order: order.reference, total })}
        </p>
        <Button asChild variant='art-outline' size='art'>
          <Link href={catalogUrl}>{t('purchase.done.back')}</Link>
        </Button>
      </StatusPanel>
    );
  }

  if (order.status !== 'pending') {
    return (
      <StatusPanel
        icon={<LuCircleX className='text-art-terracotta h-14 w-14' />}
        title={t(`order.${order.status}_title`)}
      >
        <p className='art-justify-center text-art-text-2'>{t('order.closed_text')}</p>
        <Button asChild variant='art' size='art'>
          <Link href={artworkUrl}>{t('order.try_again')}</Link>
        </Button>
      </StatusPanel>
    );
  }

  return (
    <StatusPanel
      icon={<LuClock className='text-art-gold-bright h-14 w-14' />}
      title={t('order.pending_title')}
    >
      <p className='art-justify-center text-art-text-2'>
        {t('order.pending_text', { order: order.reference })}
      </p>

      {order.paymentMethod === 'MB' && order.payment.entity && (
        <div className='border-art-line bg-art-ebony w-full border p-5 text-left'>
          <p className='art-eyebrow text-[10px]'>{t('purchase.done.mb_title')}</p>
          <dl className='mt-4 grid grid-cols-3 gap-4'>
            <OrderValue label={t('purchase.done.entity')} value={order.payment.entity} />
            <OrderValue
              label={t('purchase.done.reference')}
              value={order.payment.reference ?? '—'}
            />
            <OrderValue label={t('purchase.done.amount')} value={total} />
          </dl>
        </div>
      )}

      {order.paymentMethod === 'MBW' && (
        <p className='text-art-cream flex items-center gap-3'>
          <LuSmartphone aria-hidden className='text-art-gold-bright h-6 w-6 shrink-0' />
          {t('purchase.done.mbw_text')}
        </p>
      )}

      {order.paymentMethod === 'CC' && order.payment.url && (
        <>
          <p className='art-justify-center text-art-cream'>{t('purchase.done.cc_text')}</p>
          <Button asChild variant='art' size='art'>
            <a href={order.payment.url} target='_blank' rel='noopener noreferrer'>
              <LuCreditCard aria-hidden />
              {t('purchase.done.cc_cta', { total })}
            </a>
          </Button>
        </>
      )}

      {reservedUntil && (
        <p className='text-art-muted text-sm'>
          {t('order.reserved_until', { date: reservedUntil })}
        </p>
      )}
      <p className='text-art-muted flex items-center gap-2 text-xs' aria-live='polite'>
        <span aria-hidden className='bg-art-gold-bright h-1.5 w-1.5 animate-pulse rounded-full' />
        {t('order.waiting')}
      </p>
    </StatusPanel>
  );
}

function StatusPanel({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      role='status'
      className='art-panel mx-auto flex max-w-2xl flex-col items-center gap-6 p-8 text-center md:p-12'
    >
      {icon}
      <h1 className='art-heading'>{title}</h1>
      {children}
    </section>
  );
}

function OrderValue({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className='text-art-muted text-xs'>{label}</dt>
      <dd className='text-art-text mt-1 font-mono'>{value}</dd>
    </div>
  );
}
