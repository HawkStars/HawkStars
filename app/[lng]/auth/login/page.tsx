'use client';

import { SiFacebook, SiGmail } from 'react-icons/si';

import Button from '@/components/utils/Button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  loginWithGoogle,
  loginWithFacebook,
  loginWithEmail,
} from '@/server/OAuthLogins';
import Input from '@/components/utils/Input/Input';

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');

  /** registar com google */
  const enterWithGoogle = async (event: React.MouseEvent) => {
    event.preventDefault();
    await loginWithGoogle();
  };

  const enterWithFacebook = async (event: React.MouseEvent) => {
    event.preventDefault();
    await loginWithFacebook();
  };

  const enterWithOTP = async (event: any) => {
    event.preventDefault();
    await loginWithEmail(email);
  };

  return (
    <div className='max-width my-10 flex justify-center'>
      <div className='border-terciary-100 my-5 rounded-lg border lg:w-fit'>
        <div className='flex flex-col gap-5 p-5'>
          <Input labelText='Email' name='email' onChange={setEmail} />

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
