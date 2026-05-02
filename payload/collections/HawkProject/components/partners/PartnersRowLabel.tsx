'use client';

import { usePayloadAPI, useRowLabel } from '@payloadcms/ui';

const partnersCollection = 'partners' as const;

const PartnersRowLabel = () => {
  const { data: rowData } = useRowLabel<{
    name: string;
  }>();

  if (!rowData || !rowData.name) return <div>Unnamed Partner</div>;

  const [{ data, isError, isLoading }, { setParams }] = usePayloadAPI(
    `/api/${partnersCollection}/${rowData?.name}`,
    {
      initialParams: { depth: 1 },
    }
  );

  if (isError) return <div>Unnamed Partner</div>;
  if (isLoading) return <div>Loading...</div>;

  const name = data?.name || 'Unnamed Partner';
  return <div>{name}</div>;
};

export default PartnersRowLabel;
