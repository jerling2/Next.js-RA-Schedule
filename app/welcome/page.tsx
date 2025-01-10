"use client";
import { useRouter } from 'next/navigation';

export default function SignIn() {
    const router = useRouter();
    return (
        <div className="flex min-h-96 h-screen justify-center place-items-center drop-shadow-lg text-center">
            <div className="relative min-w-fit min-h-fit justify-center flex flex-col h-2/3 gap-y-10 w-1/2 bg-slate-50 place-items-center rounded-xl overflow-hidden">
                <div className='text-4xl mb-24 text-black'>
                    Welcome
                </div>
                <div className="min-w-96 py-[10%] flex-col ">
                    <button className='w-1/2 h-1/2 mb-10 h-1/1 bg-sky-600 text-white rounded-full text-2xl' onClick={() => router.push('/signIn/userIdentifier')}>
                    Sign in
                    </button>
                    <div className='cursor-pointer font-bold hover:underline text-sky-500' onClick={() => router.push('/createAccount')}>
                    Create an account
                    </div>
                </div>
            </div>
        </div>
    );
}