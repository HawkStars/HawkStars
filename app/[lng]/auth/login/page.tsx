'use client';

import { SiFacebook, SiGmail } from 'react-icons/si';

import Button from '@/components/utils/Button';
import { useState } from 'react';

import Input from '@/components/utils/Input/Input';
import { useRouter } from 'next/navigation';
import { urls } from '@/utils/paths';
import { loginWithGoogle, loginWithFacebook, loginWithEmail } from '@/services/OAuthLogins';

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');

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
    router.push(urls.home);
  };

  return (
    <div className='max-width my-10 flex justify-center'>
      <div className='border-terciary-100 my-5 rounded-lg border lg:w-fit'>
        <div className='flex flex-col gap-5 p-5'>
          <form className='flex flex-col gap-2' onSubmit={enterWithOTP}>
            <Input
              labelText='Email'
              name='email'
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
            <Button type='submit' className='mx-auto'>
              Login
            </Button>
          </form>
          <div className='flex flex-1 flex-row justify-center gap-5'>
            <Button outline={true} onClick={(event) => enterWithFacebook(event)} type={'button'}>
              <SiFacebook className='inline ' color='blue' size={36} />
            </Button>
            <Button onClick={(event) => enterWithGoogle(event)} type={'button'} outline={true}>
              <SiGmail color='red' className='inline' size={36} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
