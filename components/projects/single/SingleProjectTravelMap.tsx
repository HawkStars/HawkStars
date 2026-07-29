'use client';

import { Section } from '@/components/layout/Section';
import { HawkProject } from '@/payload-types';
import { Language } from '@/i18n/settings';
import { useTranslation } from '@/i18n/client';
import { useLanguageCookie } from '@/utils/contexts/AppProvider';
import {
  Map,
  MapMarker,
  MapPolyline,
  MapTileLayer,
  MapTooltip,
  MapZoomControl,
  useLeaflet,
} from '@/components/ui/map';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import type { LatLngExpression } from 'leaflet';
import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { LuTrainFront } from 'react-icons/lu';
import { useMap } from 'react-leaflet';

type DiscoverEuStop = NonNullable<HawkProject['discoverEuStops']>[number];

type SingleProjectTravelMapProps = Pick<HawkProject, 'project_type' | 'discoverEuStops'> & {
  lng?: Language;
};

/** Full loop duration for the animated train icon, in milliseconds. */
const ROUTE_DURATION_MS = 14000;
/** Fallback map center (roughly central Europe) if a stop is somehow missing coordinates. */
const FALLBACK_CENTER: LatLngExpression = [48.8566, 2.3522];

/** Adjusts the map viewport to fit every stop once the stops are known. */
function FitStopsBounds({ path }: { path: LatLngExpression[] }) {
  const map = useMap();
  const { L } = useLeaflet();

  useEffect(() => {
    if (!L || path.length === 0) return;

    if (path.length === 1) {
      map.setView(path[0], 12);
      return;
    }

    map.fitBounds(L.latLngBounds(path), { padding: [48, 48], maxZoom: 8 });
  }, [L, map, path]);

  return null;
}

/** Linear interpolation of a point along a multi-stop path, `t` in [0, 1]. */
function interpolateAlongPath(path: [number, number][], t: number): [number, number] {
  if (path.length === 0) return [0, 0];
  if (path.length === 1) return path[0];

  const segments = path.length - 1;
  const scaled = Math.min(Math.max(t, 0), 1) * segments;
  const index = Math.min(Math.floor(scaled), segments - 1);
  const segmentT = scaled - index;
  const [lat1, lng1] = path[index];
  const [lat2, lng2] = path[index + 1];

  return [lat1 + (lat2 - lat1) * segmentT, lng1 + (lng2 - lng1) * segmentT];
}

/** A train icon that continuously travels along the route, looping. */
function AnimatedTrain({ path }: { path: [number, number][] }) {
  const [position, setPosition] = useState<[number, number]>(path[0] ?? [0, 0]);
  const frameRef = useRef<number | undefined>(undefined);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    if (path.length < 2) return;

    const tick = (timestamp: number) => {
      if (startRef.current === null) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const t = (elapsed % ROUTE_DURATION_MS) / ROUTE_DURATION_MS;
      setPosition(interpolateAlongPath(path, t));
      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      startRef.current = null;
    };
  }, [path]);

  if (path.length < 2) return null;

  return (
    <MapMarker
      position={position}
      icon={<LuTrainFront className='text-primary size-6 drop-shadow' />}
      iconAnchor={[12, 12]}
      interactive={false}
      keyboard={false}
      zIndexOffset={1000}
    />
  );
}

/**
 * Renders the DiscoverEU travel route: a numbered pin per stop (with the
 * city name and date range always visible), a dashed "rail" line connecting
 * them in travel order, and a small train icon animating along the route.
 * Only rendered for projects where `project_type === 'discover_eu'` and at
 * least one stop with coordinates has been filled in.
 */
const SingleProjectTravelMap: FC<SingleProjectTravelMapProps> = ({
  project_type: projectType,
  discoverEuStops: stops,
  lng: lngProp,
}) => {
  const cookieLng = useLanguageCookie();
  const { t } = useTranslation(lngProp ?? cookieLng, 'projects');

  const validStops = useMemo(
    () =>
      (stops ?? []).filter(
        (stop): stop is DiscoverEuStop =>
          typeof stop?.latitude === 'number' &&
          typeof stop?.longitude === 'number' &&
          Boolean(stop?.city)
      ),
    [stops]
  );

  const path = useMemo<[number, number][]>(
    () => validStops.map((stop) => [stop.latitude, stop.longitude]),
    [validStops]
  );

  if (projectType !== 'discover_eu' || validStops.length === 0) return null;

  const center = path[0] ?? FALLBACK_CENTER;

  const formatStopDate = (stop: DiscoverEuStop) => {
    if (!stop.startDate) return '';
    if (stop.endDate) {
      return `${format(new Date(stop.startDate), 'd MMM', { locale: pt })} ${t('dateRange.to')} ${format(new Date(stop.endDate), 'd MMM yyyy', { locale: pt })}`;
    }
    return format(new Date(stop.startDate), "d 'de' MMMM 'de' yyyy", { locale: pt });
  };

  return (
    <Section className='bg-bege-dark'>
      <div className='mx-auto w-full max-w-6xl py-8'>
        <h2 className='mb-4 text-2xl font-bold'>{t('sections.travelRoute')}</h2>
        <div className='h-120 w-full overflow-hidden rounded-xl border'>
          <Map center={center} zoom={5} scrollWheelZoom={false}>
            <MapTileLayer />
            <MapZoomControl />
            <FitStopsBounds path={path} />

            {path.length > 1 && (
              <MapPolyline
                positions={path}
                color='var(--color-primary)'
                weight={3}
                opacity={0.8}
                dashArray='8 8'
              />
            )}

            <AnimatedTrain path={path} />

            {validStops.map((stop, index) => (
              <MapMarker
                key={stop.id ?? `${stop.city}-${index}`}
                position={[stop.latitude, stop.longitude]}
                icon={
                  <span className='bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-full text-xs font-bold shadow-md'>
                    {index + 1}
                  </span>
                }
              >
                <MapTooltip permanent side='top'>
                  <div className='text-center'>
                    <p className='font-semibold'>{stop.city}</p>
                    <p className='text-xs'>{formatStopDate(stop)}</p>
                  </div>
                </MapTooltip>
              </MapMarker>
            ))}
          </Map>
        </div>
      </div>
    </Section>
  );
};

export default SingleProjectTravelMap;
