import type { TaskConfig } from 'payload';
import { expireOverdueArtOrders } from '@/lib/art-gallery/orders';

/**
 * Every 15 minutes: re-checks, with EasyPay, the pending artwork orders whose
 * reservation is over — marking them paid if the payment did arrive, or
 * expired (freeing the reserved copy) if not. The buyer's order page and the
 * webhook do the same on demand; this catches orders nobody is looking at.
 */
export const expireArtOrdersTask: TaskConfig<{
  input: object;
  output: { checked: number };
}> = {
  slug: 'expireArtOrders',
  label: 'Expire Unpaid Artwork Orders',
  inputSchema: [],
  outputSchema: [{ name: 'checked', type: 'number', label: 'Orders checked' }],
  schedule: [
    {
      cron: '0 */15 * * * *',
      queue: 'default',
    },
  ],
  handler: async ({ req }) => {
    const checked = await expireOverdueArtOrders(req.payload);
    return { output: { checked } };
  },
};
