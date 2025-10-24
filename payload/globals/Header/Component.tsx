import React from 'react';

import type { Header } from '@/payload-types';
import { HeaderClient } from './Component.client';
import { getCachedGlobal } from '@/payload/utilities/getGlobals';

export async function Header() {
  const headerData: Header = await getCachedGlobal('header', 1)();

  return <HeaderClient data={headerData} />;
}
