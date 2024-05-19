import Image from 'next/image';

import { hawkLogo } from '@/models/images/logos';
import { urls } from '@/utils/paths';
import Link from 'next/link';

const GalleryPage = () => {
  return (
    <div className='layout-section my-auto flex h-screen items-center'>
      <div className='mx-auto flex w-2/3 flex-col justify-center gap-10 align-middle'>
        <Image src={hawkLogo} alt='HawkLogo' className='mx-auto' />
        <h3 className='text-center'>Building it. Launch on summer 2024.</h3>
        <Link
          href={urls.home}
          className='mx-auto w-fit rounded-lg border border-green bg-green fill-white p-3 text-white'
        >
          Go Back
        </Link>
      </div>
    </div>
  );
};

export default GalleryPage;
