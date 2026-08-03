'use client';

import { Section } from '@/components/layout/Section';
import { Button } from '@/components/ui/button';
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
import type { LatLngExpression } from 'leaflet';
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LuRotateCw, LuTrainFront } from 'react-icons/lu';
import { useMap } from 'react-leaflet';

type SingleProjectTravelMapProps = Pick<HawkProject, 'project_type' | 'discoverEuFields'> & {
  lng?: Language;
};

type DiscoverEuStop = {
  city: string;
  latitude?: number | null | undefined;
  longitude?: number | null | undefined;
  id?: string | null | undefined;
};

/** Minimum and maximum time (ms) the train spends traveling a single leg. */
const MIN_LEG_DURATION_MS = 1500;
const MAX_LEG_DURATION_MS = 4500;
/** Roughly how many ms of travel time per km, used to scale leg duration by distance. */
const MS_PER_KM = 6;
/** How long the train pauses at the first stop before departing. */
const INITIAL_DWELL_MS = 700;
/** How long the train pauses at each intermediate stop along the way. */
const STOP_DWELL_MS = 900;
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

/** Great-circle distance between two `[lat, lng]` points, in kilometers. */
function haversineDistanceKm([lat1, lng1]: [number, number], [lat2, lng2]: [number, number]) {
  const EARTH_RADIUS_KM = 6371;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;

  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

type TrainPhase =
  | { type: 'dwell'; position: [number, number]; duration: number; stopIndex: number }
  | { type: 'travel'; from: [number, number]; to: [number, number]; duration: number };

/**
 * Builds the one-shot sequence of phases the train steps through: a short
 * dwell at the first stop, then travel/dwell pairs for every leg after that,
 * so the journey visibly progresses stop by stop rather than as one
 * continuous, time-based sweep across the whole route. Each dwell phase
 * carries the index of the stop just reached, so callers can reveal the
 * next leg of the route exactly when the train arrives.
 */
function buildTrainPhases(path: [number, number][]): TrainPhase[] {
  if (path.length < 2) return [];

  const phases: TrainPhase[] = [
    { type: 'dwell', position: path[0], duration: INITIAL_DWELL_MS, stopIndex: 0 },
  ];

  for (let i = 0; i < path.length - 1; i++) {
    const distanceKm = haversineDistanceKm(path[i], path[i + 1]);
    const duration = Math.min(
      MAX_LEG_DURATION_MS,
      Math.max(MIN_LEG_DURATION_MS, distanceKm * MS_PER_KM)
    );
    phases.push({ type: 'travel', from: path[i], to: path[i + 1], duration });

    if (i < path.length - 2) {
      phases.push({
        type: 'dwell',
        position: path[i + 1],
        duration: STOP_DWELL_MS,
        stopIndex: i + 1,
      });
    }
  }

  return phases;
}

/**
 * A train icon that travels the route once, stop by stop, pausing briefly
 * at each station in between (rather than looping on a fixed timer).
 * Bump `replayToken` to restart the journey from the first stop. Fires
 * `onArrive` the instant the train reaches each intermediate/final stop
 * (so the next leg of the route can be revealed), and `onFinished` once
 * the whole journey has played out.
 */
function AnimatedTrain({
  path,
  replayToken,
  onArrive,
  onFinished,
}: {
  path: [number, number][];
  replayToken: number;
  onArrive: (stopIndex: number) => void;
  onFinished: () => void;
}) {
  const phases = useMemo(() => buildTrainPhases(path), [path]);
  const [position, setPosition] = useState<[number, number]>(path[0] ?? [0, 0]);
  const frameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (phases.length === 0) return;

    let startTime: number | null = null;
    let lastPhaseIndex = -1;

    const tick = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      let remaining = timestamp - startTime;

      for (let i = 0; i < phases.length; i++) {
        const phase = phases[i];
        if (remaining <= phase.duration) {
          if (i !== lastPhaseIndex) {
            lastPhaseIndex = i;
            if (phase.type === 'dwell' && phase.stopIndex > 0) {
              onArrive(phase.stopIndex);
            }
          }
          if (phase.type === 'dwell') {
            setPosition(phase.position);
          } else {
            const t = phase.duration === 0 ? 1 : remaining / phase.duration;
            const [lat1, lng1] = phase.from;
            const [lat2, lng2] = phase.to;
            setPosition([lat1 + (lat2 - lat1) * t, lng1 + (lng2 - lng1) * t]);
          }
          frameRef.current = requestAnimationFrame(tick);
          return;
        }
        remaining -= phase.duration;
      }

      // Every phase has elapsed: settle on the final stop and stop animating.
      const lastPhase = phases[phases.length - 1];
      setPosition(lastPhase.type === 'dwell' ? lastPhase.position : lastPhase.to);
      onFinished();
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
    // `replayToken` isn't read in the effect but bumping it intentionally restarts the timer.
  }, [phases, replayToken, onArrive, onFinished]);

  if (phases.length === 0) return null;

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

/** Corner button that replays the train animation from the first stop. */
function RouteReplayControl({
  onReplay,
  isFinished,
  label,
}: {
  onReplay: () => void;
  isFinished: boolean;
  label: string;
}) {
  return (
    <Button
      type='button'
      size='icon-sm'
      variant={isFinished ? 'default' : 'secondary'}
      aria-label={label}
      title={label}
      className='absolute top-1 right-1 z-1000 border'
      onClick={onReplay}
    >
      <LuRotateCw />
    </Button>
  );
}

type RouteLeg = {
  fromCity: string;
  toCity: string;
  distanceKm: number;
};

/** Side legend listing the distance of every leg of the route, plus the total. */
function RouteDistanceList({
  legs,
  totalDistanceKm,
  title,
  totalLabel,
  formatDistance,
}: {
  legs: RouteLeg[];
  totalDistanceKm: number;
  title: string;
  totalLabel: string;
  formatDistance: (distanceKm: number) => string;
}) {
  return (
    <aside className='w-full shrink-0 rounded-xl border p-4 lg:w-64'>
      <h3 className='mb-3 text-sm font-semibold'>{title}</h3>
      <ul className='space-y-2'>
        {legs.map((leg, index) => (
          <li key={index} className='flex items-center justify-between gap-3 text-sm'>
            <span className='text-muted-foreground truncate'>
              {leg.fromCity} → {leg.toCity}
            </span>
            <span className='font-medium whitespace-nowrap'>{formatDistance(leg.distanceKm)}</span>
          </li>
        ))}
      </ul>
      <div className='mt-3 flex items-center justify-between border-t pt-3 text-sm font-semibold'>
        <span>{totalLabel}</span>
        <span>{formatDistance(totalDistanceKm)}</span>
      </div>
    </aside>
  );
}

/**
 * Renders the DiscoverEU travel route: a numbered pin per stop (with the
 * city name always visible), a dashed "rail" line that reveals itself leg by
 * leg as the animated train arrives at each stop (rather than being drawn
 * all at once), and a side legend listing every leg's distance plus the
 * total. All of the animation/reveal state lives here and is remounted
 * fresh (via the `key` set by the caller) whenever the set of stops changes.
 */
function TravelRoute({
  validStops,
  lng: lngProp,
}: {
  validStops: DiscoverEuStop[];
  lng?: Language;
}) {
  const cookieLng = useLanguageCookie();
  const { t } = useTranslation(lngProp ?? cookieLng, 'projects');

  const path = useMemo<[number, number][]>(
    () => validStops.map((stop) => [stop.latitude as number, stop.longitude as number]),
    [validStops]
  );

  const legs = useMemo<RouteLeg[]>(
    () =>
      path.slice(0, -1).map((start, index) => ({
        fromCity: validStops[index]?.city ?? '',
        toCity: validStops[index + 1]?.city ?? '',
        distanceKm: Math.round(haversineDistanceKm(start, path[index + 1])),
      })),
    [path, validStops]
  );

  const totalDistanceKm = useMemo(() => {
    let total = 0;
    for (let i = 0; i < path.length - 1; i++) {
      total += haversineDistanceKm(path[i], path[i + 1]);
    }
    return Math.round(total);
  }, [path]);

  const [replayToken, setReplayToken] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  // The first leg is visible from the start; each later leg reveals itself
  // once the train arrives at the stop it departs from.
  const [visibleLegCount, setVisibleLegCount] = useState(1);

  const handleFinished = useCallback(() => setIsFinished(true), []);
  const handleArrive = useCallback((stopIndex: number) => {
    setVisibleLegCount((prev) => Math.max(prev, stopIndex + 1));
  }, []);
  const handleReplay = useCallback(() => {
    setIsFinished(false);
    setVisibleLegCount(1);
    setReplayToken((token) => token + 1);
  }, []);

  const center = path[0] ?? FALLBACK_CENTER;

  return (
    <Section className='bg-bege-dark'>
      <div className='mx-auto w-full max-w-6xl py-8'>
        <h2 className='mb-4 text-2xl font-bold'>{t('sections.travelRoute')}</h2>
        <div className='flex flex-col gap-4 lg:flex-row'>
          <div className='h-120 w-full overflow-hidden rounded-xl border lg:flex-1'>
            <Map center={center} zoom={5} scrollWheelZoom={false}>
              <MapTileLayer />
              <MapZoomControl />
              {path.length > 1 && (
                <RouteReplayControl
                  onReplay={handleReplay}
                  isFinished={isFinished}
                  label={t('map.replay')}
                />
              )}
              <FitStopsBounds path={path} />

              {legs.map((_leg, index) => {
                if (index >= visibleLegCount) return null;

                return (
                  <MapPolyline
                    key={`leg-${index}`}
                    positions={[path[index], path[index + 1]]}
                    color='var(--color-primary)'
                    weight={3}
                    opacity={0.8}
                    dashArray='8 8'
                  />
                );
              })}

              {path.length > 1 && (
                <AnimatedTrain
                  path={path}
                  replayToken={replayToken}
                  onArrive={handleArrive}
                  onFinished={handleFinished}
                />
              )}

              {validStops.map((stop, index) => {
                // A stop only appears once the leg leading to it has been
                // revealed (the first two stops are visible from the start).
                if (index > visibleLegCount) return null;

                return (
                  <MapMarker
                    key={stop.id ?? `${stop.city}-${index}`}
                    position={[stop.latitude as number, stop.longitude as number]}
                    icon={
                      <span className='bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-full text-xs font-bold shadow-md'>
                        {index + 1}
                      </span>
                    }
                  >
                    <MapTooltip permanent side='top'>
                      <div className='text-center'>
                        <p className='font-semibold'>{stop.city}</p>
                      </div>
                    </MapTooltip>
                  </MapMarker>
                );
              })}
            </Map>
          </div>

          {legs.length > 0 && (
            <RouteDistanceList
              legs={legs}
              totalDistanceKm={totalDistanceKm}
              title={t('map.distances')}
              totalLabel={t('map.totalDistance')}
              formatDistance={(distanceKm) => t('map.distance', { distance: distanceKm })}
            />
          )}
        </div>
      </div>
    </Section>
  );
}

/**
 * Entry point: filters the CMS-provided stops down to the ones with usable
 * coordinates and mounts `TravelRoute` keyed by that set of stops, so all of
 * its animation/reveal state starts fresh whenever the route itself changes.
 */
const SingleProjectTravelMap: FC<SingleProjectTravelMapProps> = ({
  project_type: projectType,
  discoverEuFields,
  lng: lngProp,
}) => {
  const { discoverEuStops: stops } = discoverEuFields ?? {};

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

  if (projectType !== 'discover_eu' || validStops.length === 0) return null;

  const routeKey = validStops
    .map((stop) => stop.id ?? `${stop.latitude},${stop.longitude}`)
    .join('|');

  return <TravelRoute key={routeKey} validStops={validStops} lng={lngProp} />;
};

export default SingleProjectTravelMap;
