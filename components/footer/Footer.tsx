'use client';

import { ImageMedia } from '@/payload/components/Media';

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
          <ImageMedia
            className='max-w-40 object-cover'
            src={hawkLogo}
            alt='hawkstars'
            sizes='100px'
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
