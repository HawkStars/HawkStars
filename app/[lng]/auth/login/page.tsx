'use client';

import { SiFacebook, SiGmail } from 'react-icons/si';

import Button from '@/components/utils/Button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { loginWithGoogle, loginWithFacebook } from '@/server/OAuthLogins';

const LoginPage = () => {
  const router = useRouter();
  const [type, setType] = useState<'register' | 'login'>('login');

  /** registar com google */
  const enterWithGoogle = async (event: React.MouseEvent) => {
    event.preventDefault();
    await loginWithGoogle();
  };

  const enterWithFacebook = async (event: React.MouseEvent) => {
    event.preventDefault();
    await loginWithFacebook();
  };

  return (
    <div className='max-width my-10 flex justify-center'>
      <div className='border-terciary-100 my-5 rounded-lg border lg:w-fit'>
        <div className='p-5'>
          <div className='flex flex-1 flex-row justify-center gap-5'>
            <Button
              outline={true}
              onClick={(event) => enterWithFacebook(event)}
              type={'button'}
            >
              <SiFacebook className='inline ' color='blue' size={36} />
            </Button>
            <Button
              onClick={(event) => enterWithGoogle(event)}
              type={'button'}
              outline={true}
            >
              <SiGmail color='red' className='inline' size={36} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
