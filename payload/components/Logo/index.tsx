import HawkLogo from '@/public/images/logos/logo.webp';
import Image from 'next/image';

export default function PayloadHawkLogo() {
  return (
    <Image src={HawkLogo} alt='HawkStars Logo' className='rounded-xl bg-white p-8 shadow-lg' />
  );
}
