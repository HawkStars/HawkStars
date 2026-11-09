'use client';

import dynamic from 'next/dynamic';
import { FC } from 'react';
import { useTranslation } from '@/i18n/client';
import { Language } from '@/i18n/settings';
import { Partner } from '@/payload-types';

/** The minimum a map pin needs — never the whole partner document. */
export type PartnerPin = {
  id: string;
  name: string;
  countryLabel: string;
  logoUrl: string | null;
  type: Partner['type'];
  latitude: number;
  longitude: number;
};

// Leaflet touches `window` on import, so the map only ever renders in the browser.
const PartnersMapView = dynamic(() => import('./PartnersMapView'), {
  ssr: false,
  loading: () => <div className='bg-bege-dark/60 size-full animate-pulse' />,
});

type PartnersMapProps = {
  pins: PartnerPin[];
  lng: Language;
};

const PartnersMap: FC<PartnersMapProps> = ({ pins, lng }) => {
  const { t } = useTranslation(lng, 'partners');
  if (pins.length === 0) return null;

  return (
    <div
      className='border-bege-dark relative isolate h-80 w-full overflow-hidden rounded-xl border sm:h-96 lg:h-120'
      role='region'
      aria-label={t('map.label')}
    >
      <PartnersMapView pins={pins} logoAlt={(name) => t('a11y.logoAlt', { name })} />
    </div>
  );
};

export default PartnersMap;
