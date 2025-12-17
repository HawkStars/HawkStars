'use client';

import { Map, MapTileLayer } from '@/components/ui/map';
import { LatLngExpression } from 'leaflet';

const TORONTO_COORDINATES = [43.6532, -79.3832] satisfies LatLngExpression;

const PartnersMap = () => {
  return (
    <Map center={TORONTO_COORDINATES} zoom={5}>
      <MapTileLayer />
    </Map>
  );
};

export default PartnersMap;
