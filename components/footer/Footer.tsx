'use client';

import Image from 'next/image';

import { hawkLogo } from '@/utils/models/images/logos';
import { useMainAppContext } from '@/utils/contexts/AppProvider';
import FooterMenu from './FooterMenu';
import FooterBottom from './FooterBottom';

const Footer = () => {
  const { lng, footerInfo } = useMainAppContext();

  return (
    <footer className='mt-8'>
      <div className='flex gap-10 p-5 max-lg:flex-col'>
        <div className='flex flex-col gap-5'>
          <Image
            className='max-w-40'
            src={hawkLogo}
            alt='hawkstars'
            sizes='100px'
            style={{ objectFit: 'cover' }}
          />
        </div>

        {footerInfo && footerInfo.columns && footerInfo.columns?.length > 0 && (
          <div className='mt-10 grid grid-cols-6 gap-10 max-lg:grid-cols-3 max-sm:grid-cols-1'>
            {footerInfo?.columns?.map((column) => (
              <FooterMenu key={column.id} data={column} />
            ))}
          </div>
        )}
      </div>
      <FooterBottom lng={lng} />
    </footer>
  );
};

export default Footer;
