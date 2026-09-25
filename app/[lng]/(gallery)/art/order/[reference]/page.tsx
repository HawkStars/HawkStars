import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LanguageProps } from '@/components/types';
import { SITE_GET_URLS, transformUrl } from '@/utils/paths';
import { getPayloadConfig } from '@/lib/payload/server';
import { findOrderForBuyer, syncArtOrder, toPublicOrder } from '@/lib/art-gallery/orders';
import OrderStatus from '@/components/art/order/OrderStatus';
import { artworkUrl } from '@/components/art/artwork/helpers';

type OrderPageProps = {
  params: Promise<LanguageProps & { reference: string }>;
  searchParams: Promise<{ token?: string }>;
};

// Private to the buyer (secret token in the link): never indexed.
export const metadata: Metadata = { robots: { index: false, follow: false } };

/**
 * The buyer's order page — where they land after confirming the purchase and
 * from the link in their email. Shows the payment instructions and turns to
 * "paid" once EasyPay confirms it.
 */
export default async function OrderPage(props: OrderPageProps) {
  const [{ lng, reference }, { token = '' }] = await Promise.all([
    props.params,
    props.searchParams,
  ]);

  const payload = await getPayloadConfig();
  const order = await findOrderForBuyer(payload, reference, token);
  if (!order) notFound();

  const current = await syncArtOrder(payload, order);
  const artwork = typeof current.artwork === 'string' ? null : current.artwork;

  return (
    <div className='art-spotlight px-4 py-16 lg:px-8 lg:py-24'>
      <OrderStatus
        initialOrder={toPublicOrder(current)}
        token={token}
        artworkUrl={artwork ? artworkUrl(lng, artwork) : transformUrl(lng, SITE_GET_URLS.artwork)}
        catalogUrl={transformUrl(lng, SITE_GET_URLS.artwork)}
      />
    </div>
  );
}
