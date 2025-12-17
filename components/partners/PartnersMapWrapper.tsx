'use client';

import dynamic from 'next/dynamic';

const PartnersMap = dynamic(() => import('./PartnersMap'), {
  ssr: false,
  loading: () => <div className='h-60 animate-pulse bg-gray-200 md:h-96 lg:h-125' />,
});

const PartnersMapWrapper = () => {
  return <PartnersMap />;
};

export default PartnersMapWrapper;
