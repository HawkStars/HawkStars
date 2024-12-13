import Link from 'next/link';
import { AiOutlineMail } from 'react-icons/ai';
import {
  PiFacebookLogoBold,
  PiInstagramLogoBold,
  PiLinkedinLogoBold,
  PiYoutubeLogoBold,
} from 'react-icons/pi';

const Socials = () => {
  return (
    <div className='flex gap-1'>
      <Link
        target='_blank'
        href='https://www.youtube.com/@HawkStarsNGO'
        aria-label='Check HawkStars NGO on Youtube'
      >
        <PiYoutubeLogoBold size={24} />
      </Link>
      <Link
        target='_blank'
        href='https://www.instagram.com/hawk.starsngo/'
        aria-label='Check HawkStars NGO on Instagram'
      >
        <PiInstagramLogoBold size={24} />
      </Link>
      <Link
        href='https://www.facebook.com/hawkstarsngo'
        target='_blank'
        aria-label='Check HawkStars NGO on Facebook'
      >
        <PiFacebookLogoBold size={24} />
      </Link>
      <Link
        href='https://www.linkedin.com/company/hawkstars-ngo'
        target='_blank'
        aria-label='Check HawkStars NGO on Linkedin'
      >
        <PiLinkedinLogoBold size={24} />
      </Link>
      <Link
        href='mailto:hawkstarsngo@gmail.com'
        aria-label='Click to send an email to HawkStars NGO'
      >
        <AiOutlineMail size={24} />
      </Link>
    </div>
  );
};

export default Socials;
