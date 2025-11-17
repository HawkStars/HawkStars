import Link from 'next/link';
import Image from 'next/image';

import MailIcon from '@/public/images/icons/common/mail.svg';

import FacebookIcon from '@/public/images/icons/socials/facebook.svg';
import InstagramIcon from '@/public/images/icons/socials/instagram.svg';
import LinkedinIcon from '@/public/images/icons/socials/linkedin.svg';
import YoutubeIcon from '@/public/images/icons/socials/youtube.svg';

const Socials = () => {
  return (
    <div className='flex gap-1'>
      <Link
        target='_blank'
        href='https://www.youtube.com/@HawkStarsNGO'
        aria-label='Check HawkStars NGO on Youtube'
      >
        <Image src={YoutubeIcon} alt='Youtube' width={24} height={24} className='grayscale' />
      </Link>
      <Link
        target='_blank'
        href='https://www.instagram.com/hawk.starsngo'
        aria-label='Check HawkStars NGO on Instagram'
      >
        <Image src={InstagramIcon} alt='Instagram' width={24} height={24} className='grayscale' />
      </Link>
      <Link
        href='https://www.facebook.com/hawkstarsngo'
        target='_blank'
        aria-label='Check HawkStars NGO on Facebook'
      >
        <Image src={FacebookIcon} alt='Facebook' width={24} height={24} className='grayscale' />
      </Link>
      <Link
        href='https://www.linkedin.com/company/hawkstars-ngo'
        target='_blank'
        aria-label='Check HawkStars NGO on Linkedin'
      >
        <Image src={LinkedinIcon} alt='Linkedin' width={24} height={24} className='grayscale' />
      </Link>
      <Link
        href='mailto:hawkstarsngo@gmail.com'
        aria-label='Click to send an email to HawkStars NGO'
      >
        <Image src={MailIcon} alt='Email' width={24} height={24} />
      </Link>
    </div>
  );
};

export default Socials;
