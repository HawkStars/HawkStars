'use client';

import Image from 'next/image';

import { hawkLogo } from '@/utils/models/images/logos';
import { useTranslation } from '@/i18n/client';
import { useMainAppContext } from '@/utils/contexts/AppProvider';
import FooterMenu from './FooterMenu';
import FooterBottom from './FooterBottom';
import { Button } from '../ui/button';
import { urls } from '@/utils/paths';
import { useRouter } from 'next/navigation';

const Footer = () => {
  const router = useRouter();
  const { lng, footerInfo } = useMainAppContext();
  const { t } = useTranslation(lng, 'common');

  return (
    <footer className='mt-4'>
      <div className='flex gap-10 p-5'>
        <div className='flex flex-col gap-5'>
          <Image
            className='max-w-40'
            src={hawkLogo}
            alt='hawkstars'
            sizes='100px'
            style={{ objectFit: 'cover' }}
          />
          <Button
            type='button'
            className='w-40'
            variant='outline'
            onClick={() => {
              router.push(urls.donate);
            }}
          >
            {t('common.donate')}
          </Button>
        </div>

        <div className='mt-10 grid grid-cols-2 gap-10 max-sm:grid-cols-1'>
          {footerInfo?.columns?.map((column) => (
            <FooterMenu key={column.id} data={column} />
          ))}
        </div>
      </div>
      <FooterBottom />
    </footer>
  );
};

export default Footer;
