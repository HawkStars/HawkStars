import Link from 'next/link';
import { AiOutlineMail } from 'react-icons/ai';
import {
  PiFacebookLogoBold,
  PiInstagramLogoBold,
  PiLinkedinLogoBold,
} from 'react-icons/pi';

const Socials = () => {
  return (
    <div className='flex gap-1'>
      <Link target='_blank' href='https://www.instagram.com/hawk.starsngo/'>
        <PiInstagramLogoBold size={24} />
      </Link>
      <Link href='https://www.facebook.com/hawkstarsngo' target='_blank'>
        <PiFacebookLogoBold size={24} />
      </Link>
      <Link
        href='https://www.linkedin.com/company/hawkstars-ngo'
        target='_blank'
      >
        <PiLinkedinLogoBold size={24} />
      </Link>
      <Link href='mailto:hawkstarsngo@gmail.com'>
        <AiOutlineMail size={24} />
      </Link>
    </div>
  );
};

export default Socials;
