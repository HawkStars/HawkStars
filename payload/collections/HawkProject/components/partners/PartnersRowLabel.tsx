'use client';

import { FlagIcons } from '@/lib/flags';
import { usePayloadAPI, useRowLabel } from '@payloadcms/ui';

const partnersCollection = 'partners' as const;

const PartnersRowLabel = () => {
  const { data: rowData } = useRowLabel<{
    partner: string;
  }>();

  if (!rowData || !rowData.partner) return <div>Unnamed Partner</div>;

  const [{ data, isError, isLoading }] = usePayloadAPI(
    `/api/${partnersCollection}/${rowData?.partner}`,
    {
      initialParams: { depth: 1 },
    }
  );

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Unnamed Partner</div>;

  const { name, country } = data || {};

  const displayName = name || 'Unnamed Partner';
  const flagIcon = country && FlagIcons[country];
  return (
    <div className='flex gap-2'>
      {flagIcon && flagIcon({ title: country, className: 'w-8' })}
      {displayName}
    </div>
  );
};

export default PartnersRowLabel;
