"use client";
import { useRouter } from 'next/navigation';

export default function SignIn() {
    const router = useRouter();
    
    return (
        <div className="relative flex flex-row h-screen justify-center items-center">
         
            <div className="relative flex flex-col min-w-[400px] w-1/4 aspect-square justify-between bg-background-2 shadow-color items-center rounded-2xl">

                <div className='text-5xl mt-7 font-bold bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text'>
                    Welcome
                </div>

                <button className='bg-primary font-bold text-lg text-background-1 rounded-full w-1/3 aspect-[3/1] cursor-pointer hover:bg-primary-hover transition-all duration-200' onClick={() => router.push('/signIn/userIdentifier')}>
                    Sign in
                </button>

                <div className='font-bold text-accent text-base mb-7 cursor-pointer hover:bg-accent-10 rounded-full p-2 transition-all duration-200' onClick={() => router.push('/createAccount')}>
                    Create an account
                </div>
                
            </div>
        </div>

    );
}