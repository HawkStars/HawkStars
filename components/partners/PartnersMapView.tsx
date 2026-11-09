'use client';

import { FC, useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { LuMapPin } from 'react-icons/lu';
import {
  Map,
  MapMarker,
  MapPopup,
  MapTileLayer,
  MapZoomControl,
  useLeaflet,
} from '@/components/ui/map';
import { ImageMedia } from '@/payload/components/Media';
import { getInitials } from '@/lib/initials';
import { cn } from '@/lib/utils';
import type { PartnerPin } from './PartnersMap';

/** Roughly central Europe, used before the pins are fitted. */
const DEFAULT_CENTER: [number, number] = [48, 10];

/** Fits the viewport to every pin once Leaflet has loaded. */
const FitPins: FC<{ pins: PartnerPin[] }> = ({ pins }) => {
  const map = useMap();
  const { L } = useLeaflet();

  useEffect(() => {
    if (!L || pins.length === 0) return;
    if (pins.length === 1) {
      map.setView([pins[0].latitude, pins[0].longitude], 8);
      return;
    }
    map.fitBounds(L.latLngBounds(pins.map((pin) => [pin.latitude, pin.longitude])), {
      padding: [40, 40],
      maxZoom: 8,
    });
  }, [L, map, pins]);

  return null;
};

type PartnersMapViewProps = {
  pins: PartnerPin[];
  logoAlt: (name: string) => string;
};

const PartnersMapView: FC<PartnersMapViewProps> = ({ pins, logoAlt }) => (
  <Map center={DEFAULT_CENTER} zoom={4} scrollWheelZoom={false} className='min-h-0 rounded-none'>
    <MapTileLayer />
    <MapZoomControl />
    <FitPins pins={pins} />
    {pins.map((pin) => (
      <MapMarker
        key={pin.id}
        position={[pin.latitude, pin.longitude]}
        title={pin.name}
        // The pin's tip sits on the coordinate; the popup opens above it.
        iconAnchor={[14, 28]}
        popupAnchor={[0, -26]}
        icon={
          <LuMapPin
            className={cn(
              'size-7 fill-white drop-shadow-md',
              pin.type === 'international' ? 'text-ink' : 'text-green'
            )}
          />
        }
      >
        <MapPopup className='w-60 p-0'>
          <div className='flex flex-col items-center gap-3 p-4 text-center'>
            <div className='flex h-16 w-full items-center justify-center'>
              {pin.logoUrl ? (
                <ImageMedia
                  src={pin.logoUrl}
                  alt={logoAlt(pin.name)}
                  width={120}
                  height={64}
                  sizes='120px'
                  className='max-h-16 w-auto object-contain'
                />
              ) : (
                <span
                  aria-hidden='true'
                  className='bg-bege-dark text-green font-display flex size-14 items-center justify-center rounded-full text-lg font-semibold'
                >
                  {getInitials(pin.name)}
                </span>
              )}
            </div>
            <p className='text-body_semibold text-foreground leading-snug text-balance'>
              {pin.name}
            </p>
            <p className='text-eyebrow text-black/60'>{pin.countryLabel}</p>
          </div>
        </MapPopup>
      </MapMarker>
    ))}
  </Map>
);

export default PartnersMapView;
