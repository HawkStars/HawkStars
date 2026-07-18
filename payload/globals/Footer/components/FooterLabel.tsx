'use client';

import { makeRowLabel } from '@/payload/components/admin/makeRowLabel';

export const FooterLabel = makeRowLabel({
  fallback: 'Menu',
  getTitle: (data) => (data.column as { title?: string } | undefined)?.title,
});
