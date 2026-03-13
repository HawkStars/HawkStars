import Image from 'next/image';

import { hawkLogo } from '@/utils/models/images/logos';

export default function MainHawkStarsLoading() {
  return (
    <div className='mx-auto mt-10 flex w-1/2 justify-center align-middle lg:mt-20'>
      <div className='bg-bege-dark animate-pulse rounded-3xl p-4'>
        <Image src={hawkLogo} alt='Hawk Stars Logo' width={200} />
      </div>
    </div>
  );
}
