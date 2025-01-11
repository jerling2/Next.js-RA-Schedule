"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FieldInput from '@/components/FieldInput';
import SmallButton from '@/components/NextButton';
import { checkUserEmail } from "@/lib/client/auth";
import { useEmailContext } from '@/components/EmailProvider';

export default function EmailSignIn() {
    const router = useRouter();
    const {email, setEmail} = useEmailContext();
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
      <div className='text-5xl mt-7 pb-2 h-fit font-bold bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text'>
          Sign in
      </div>
      <div className={`w-[75%] max-h-24 aspect-[4/1] bg-background-1 border-primary text-primary ${shake ? 'animate-shake' : ''}`}
      onAnimationEnd={() => setShake(false)}>
        <FieldInput 
          placeholder={`Email${isError ? ' - Couldn\'t find your account' : ''}`} 
          value={email} pattern={emailRegExpString} 
          onChange={handleFieldChange} 
          disabled={isLoading}
          invalid={isError}/>
      </div>
      <div className='flex flex-row w-[75%] h-12 justify-between place-items-center mb-7'>
        <div className='cursor-pointer text-accent hover:bg-accent-hover rounded-full p-2 font-bold'
        onClick={() => router.push('/createAccount')}>
          Create account
        </div>
        <div className='w-24 h-full [&>*]:bg-primary text-black [&>*]:hover:bg-primary-hover'>
          <SmallButton isLoading={isLoading} onClick={handleOnButtonClick}/>
        </div>
      </div>
      </>
    );
  }