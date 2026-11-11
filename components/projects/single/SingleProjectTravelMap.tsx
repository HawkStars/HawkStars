'use client';

import { ContentSection } from '@/components/layout';
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
import { LuHouse, LuRotateCw, LuTrainFront } from 'react-icons/lu';
import { cn } from '@/lib/utils';
import { useMap } from 'react-leaflet';
import SectionHeader from '@/components/ui/SectionHeader';

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
      if (!path[0]) return;
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
        if (!phase) return;

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
      if (!lastPhase) return;
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
      icon={
        <span className='relative flex size-9 items-center justify-center'>
          <span className='bg-green/30 absolute inset-0 animate-ping rounded-full' />
          <span className='bg-green relative flex size-9 items-center justify-center rounded-full text-white shadow-md ring-3 ring-white'>
            <LuTrainFront className='size-4.5' />
          </span>
        </span>
      }
      iconAnchor={[18, 18]}
      interactive={false}
      keyboard={false}
      zIndexOffset={1000}
    />
  );
}

/** Floating button on the map that replays the train animation from the first stop. */
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
      size='sm'
      variant={isFinished ? 'default' : 'outline'}
      className={cn(
        'absolute bottom-3 left-3 z-1000 shadow-md',
        !isFinished && 'hover:bg-bege-light bg-white'
      )}
      onClick={onReplay}
    >
      <LuRotateCw aria-hidden='true' />
      {label}
    </Button>
  );
}

type RouteLeg = {
  fromCity: string;
  toCity: string;
  distanceKm: number;
};

type StopState = 'reached' | 'next' | 'upcoming';

/**
 * Stop state while the train runs: stops before the leading edge are reached, the one
 * the train is heading to is "next", the rest are still to come.
 */
const getStopState = (index: number, visibleLegCount: number, isFinished: boolean): StopState => {
  if (isFinished || index < visibleLegCount) return 'reached';
  return index === visibleLegCount ? 'next' : 'upcoming';
};

/** Map pin for one stop: a gold house for the departure, numbered pins after it. */
function StopPin({ index, state }: { index: number; state: StopState }) {
  if (index === 0) {
    return (
      <span className='bg-gold text-ink flex size-8 items-center justify-center rounded-full shadow-md ring-3 ring-white'>
        <LuHouse className='size-4' />
      </span>
    );
  }
  return (
    <span
      className={cn(
        'flex size-7 items-center justify-center rounded-full text-xs font-bold shadow-md ring-3 ring-white',
        state === 'reached' ? 'bg-green text-white' : 'border-green text-green border-2 bg-white'
      )}
    >
      {index}
    </span>
  );
}

/**
 * The itinerary beside the map: total distance up top, then every stop on a vertical
 * line with the distance of the leg that follows it. Stops fill in as the train reaches
 * them, so the list and the animation tell the same story.
 */
function RouteItinerary({
  stops,
  legs,
  totalDistanceKm,
  visibleLegCount,
  isFinished,
}: {
  stops: DiscoverEuStop[];
  legs: RouteLeg[];
  totalDistanceKm: number;
  visibleLegCount: number;
  isFinished: boolean;
}) {
  const lng = useLanguageCookie();
  const { t } = useTranslation(lng, 'projects');
  const km = (distanceKm: number) =>
    t('map.distance', { distance: distanceKm.toLocaleString(lng === 'en' ? 'en-US' : 'pt-PT') });

  // Keep the stop the train is heading to in view. Scrolls the panel only (never the
  // page), and only when the panel actually scrolls, i.e. on desktop.
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const panel = scrollRef.current;
    const target = panel?.querySelector<HTMLElement>(`[data-stop='${visibleLegCount}']`);
    if (!panel || !target || panel.scrollHeight <= panel.clientHeight) return;
    panel.scrollTo({
      top: Math.max(target.offsetTop - panel.clientHeight / 2, 0),
      behavior: 'smooth',
    });
  }, [visibleLegCount]);

  return (
    <aside className='card border-bege-dark flex w-full flex-col border bg-white lg:h-120 lg:w-80 lg:shrink-0'>
      <div className='border-bege-dark bg-bege-light flex items-end justify-between gap-4 rounded-t-xl border-b p-5'>
        <div>
          <p className='text-eyebrow text-black/60'>{t('map.totalDistance')}</p>
          <p className='font-display text-green mt-1 text-3xl leading-none font-semibold tabular-nums'>
            {km(totalDistanceKm)}
          </p>
        </div>
        <p className='text-sm font-medium text-black/60'>
          {t('map.stops', { count: stops.length })}
        </p>
      </div>

      <div ref={scrollRef} className='relative flex-1 overflow-y-auto p-5'>
        <h3 className='text-eyebrow text-green mb-4'>{t('map.itinerary')}</h3>
        <ol>
          {stops.map((stop, index) => {
            const state = getStopState(index, visibleLegCount, isFinished);
            const leg = legs[index];
            const isLast = index === stops.length - 1;

            return (
              <li key={stop.id ?? `${stop.city}-${index}`} data-stop={index} className='flex gap-3'>
                <div className='flex flex-col items-center'>
                  <span
                    className={cn(
                      'flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors duration-500',
                      index === 0 && 'bg-gold text-ink',
                      index > 0 && state === 'reached' && 'bg-green text-white',
                      index > 0 && state === 'next' && 'border-green text-green border-2 bg-white',
                      index > 0 && state === 'upcoming' && 'bg-bege-dark text-black/50'
                    )}
                  >
                    {index === 0 ? <LuHouse aria-hidden='true' className='size-3.5' /> : index}
                  </span>
                  {!isLast && (
                    <span
                      aria-hidden='true'
                      className={cn(
                        'my-1 w-0.5 flex-1 rounded-full transition-colors duration-500',
                        index < visibleLegCount - 1 || isFinished ? 'bg-green' : 'bg-bege-dark'
                      )}
                    />
                  )}
                </div>
                <div className={cn('flex flex-col', !isLast && 'pb-4')}>
                  <span
                    className={cn(
                      'text-body_semibold leading-7 transition-colors duration-500',
                      state === 'upcoming' && 'text-black/50'
                    )}
                  >
                    {stop.city}
                  </span>
                  {index === 0 && (
                    <span className='text-xs text-black/60'>{t('map.departure')}</span>
                  )}
                  {state === 'next' && index > 0 && (
                    <span className='text-green text-xs font-semibold'>{t('map.next')}</span>
                  )}
                  {leg && (
                    <span className='mt-1 inline-flex w-fit items-center gap-1.5 text-xs text-black/60 tabular-nums'>
                      <LuTrainFront aria-hidden='true' className='size-3.5' />
                      {km(leg.distanceKm)}
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
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

  // A round trip ends where it started; skip the last pin so it doesn't cover the house.
  const [firstLat, firstLng] = path[0] ?? [];
  const isRoundTrip =
    path.length > 2 &&
    path[path.length - 1]?.[0] === firstLat &&
    path[path.length - 1]?.[1] === firstLng;

  return (
    <ContentSection>
      <SectionHeader title={t('sections.travelRoute')} className='mb-8' />
      <div className='flex flex-col gap-5 lg:flex-row'>
        <div className='card-md border-bege-dark relative h-96 w-full overflow-hidden border sm:h-110 lg:h-120 lg:flex-1'>
          <Map center={center} zoom={5} scrollWheelZoom={false} className='rounded-none'>
            <MapTileLayer />
            <MapZoomControl className='top-3 left-3' />
            {path.length > 1 && (
              <RouteReplayControl
                onReplay={handleReplay}
                isFinished={isFinished}
                label={t('map.replay')}
              />
            )}
            <FitStopsBounds path={path} />

            {/* The whole trip as a faint guide, then the travelled legs drawn over it. */}
            {path.length > 1 && (
              <MapPolyline
                positions={path}
                color='var(--color-green)'
                weight={3}
                opacity={0.3}
                dashArray='2 8'
                lineCap='round'
              />
            )}
            {legs.map((_leg, index) => {
              if (index >= visibleLegCount) return null;

              return (
                <MapPolyline
                  key={`leg-${index}`}
                  positions={[path[index], path[index + 1]]}
                  color='var(--color-green)'
                  weight={4}
                  opacity={0.9}
                  lineCap='round'
                />
              );
            })}

            {validStops.map((stop, index) => {
              if (isRoundTrip && index === validStops.length - 1 && index > 0) return null;
              const state = getStopState(index, visibleLegCount, isFinished);

              return (
                <MapMarker
                  key={stop.id ?? `${stop.city}-${index}`}
                  position={[stop.latitude as number, stop.longitude as number]}
                  icon={<StopPin index={index} state={state} />}
                  iconAnchor={index === 0 ? [16, 16] : [14, 14]}
                  zIndexOffset={index === 0 ? 500 : 0}
                >
                  <MapTooltip side='top'>
                    <p className='font-semibold'>{stop.city}</p>
                  </MapTooltip>
                </MapMarker>
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
          </Map>
        </div>

        {legs.length > 0 && (
          <RouteItinerary
            stops={validStops}
            legs={legs}
            totalDistanceKm={totalDistanceKm}
            visibleLegCount={visibleLegCount}
            isFinished={isFinished}
          />
        )}
      </div>
    </ContentSection>
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
