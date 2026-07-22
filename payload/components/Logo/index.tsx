import HawkLogo from '@/public/images/logos/logo.webp';
import { ImageMedia } from '@/payload/components/Media';

export default function PayloadHawkLogo() {
  return (
    <ImageMedia src={HawkLogo} alt='HawkStars Logo' className='rounded-xl bg-white p-8 shadow-lg' />
  );
}
