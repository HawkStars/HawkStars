import Image from 'next/image';
import { connection } from 'next/server';
import Link from 'next/link';

import { urls } from '@/utils/paths';
import { hawkLogo } from '@/utils/models/images/logos';

export default async function NotFoundPage() {
  await connection();
  return (
    <div className='my-auto flex items-center'>
      <div className='mx-auto flex w-2/3 flex-col justify-center gap-10 align-middle'>
        <Image src={hawkLogo} alt='HawkLogo' className='mx-auto' />
        <h3 className='text-center'>A member of this NGO is dreaming about this page content.</h3>
        <Link
          href={urls.home}
          className='border-green bg-green mx-auto w-fit rounded-lg border fill-white p-3 text-white'
        >
          Go Back
        </Link>
      </div>
    </div>
  );
}
