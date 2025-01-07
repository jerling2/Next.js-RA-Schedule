"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FieldInput from '@/components/FieldInput';
import SmallButton from '@/components/NextButton';
import { checkUserEmail } from "@/lib/client/auth";
import { useSignInContext } from '@/components/SignInProvider';

export default function EmailSignIn() {
    const router = useRouter();
    const {email, setEmail} = useSignInContext();
    const [isLoading, setLoading] = useState<boolean>(false);
    const [shake, setShake] = useState<boolean>(false);
    const [isError, setError] = useState<boolean>(false);
    const emailRegExp = /.+@.+/
    const emailRegExpString = ".+@.+"

    const handleFieldChange = (textInput: string) => {
      setEmail(textInput);
    }

    const validateEmail = (): boolean => {
      return emailRegExp.test(email);
    }

    const handleOnButtonClick = async () => {
      const isEmailValid = validateEmail();
      if (!isEmailValid) {
        setShake(true);
        return;
      }
      setLoading(true);
      const userExists = await checkUserEmail(email);
      if (!userExists) {
        setShake(true);
        setError(true);
        setLoading(false);
      } else {
        setError(false);
        router.push('/signIn/userPassword');
      }
    }

    return (
      <>
      <div className='text-4xl mb-24 text-black'>
          Sign in
      </div>
      <div className='flex flex-col gap-y-2 place-items-start w-full h-1/5'>
        <div className={`w-full h-full ${shake ? 'animate-shake' : ''}`} onAnimationEnd={() => setShake(false)}>
          <FieldInput placeholder={`Email${isError ? ' - Couldn\'t find your account' : ''}`} value={email} pattern={emailRegExpString} onChange={handleFieldChange} disabled={isLoading} invalid={isError}/>
        </div>
        <div className='cursor-pointer hover:bg-sky-100 rounded-full p-1 text-sky-500 font-bold'>
          Forgot email?
        </div>
      </div>
      <div className='flex flex-row w-full h-12 justify-between place-items-center'>
        <div className='cursor-pointer hover:bg-sky-100 rounded-full p-1 text-sky-500 font-bold'
        onClick={() => router.push('/createAccount')}>
          Create account
        </div>
        <div className='w-24 h-full'>
          <SmallButton isLoading={isLoading} onClick={handleOnButtonClick}/>
        </div>
      </div>
      </>
    );
  }