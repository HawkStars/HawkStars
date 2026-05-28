'use client';

import dynamic from 'next/dynamic';

const Footer = dynamic(() => import('@/components/footer/Footer'), {
  ssr: false,
});

const FooterWrapper = () => {
  return <Footer />;
};

export default FooterWrapper;
