import Image from 'next/image';
import logoPng from '@/public/images/logo.png';

export default function MainHawkStarsLoading() {
  return (
    <div className='mx-auto mt-10 flex w-1/2 justify-center align-middle lg:mt-20'>
      <div className='animate-pulse rounded-3xl bg-bege-dark p-4'>
        <Image src={logoPng} alt='Hawk Stars Logo' width={200} />
      </div>
    </div>
  );
}
