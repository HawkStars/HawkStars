'use client';

import { HawkProjectDiscoverEuItineraryDates } from '@/payload-types';
import { useRowLabel } from '@payloadcms/ui';

const DiscoverEUItineraryRowLabel = () => {
  const { data } = useRowLabel<HawkProjectDiscoverEuItineraryDates>();
  const { startDate, endDate } = (data as unknown as { startDate: Date; endDate: Date }) || {};

  const text = `${new Date(startDate).toLocaleDateString('pt-PT')} - ${new Date(endDate).toLocaleDateString('pt-PT')}`;
  const fallback = 'Unnamed Itinerary';
  const capitalize = true;

  return (
    <div style={capitalize ? { textTransform: 'capitalize' } : undefined}>{text || fallback}</div>
  );
};

export default DiscoverEUItineraryRowLabel;
