"use client";
import { useRouter } from 'next/navigation';


export default function Home() {
  const router = useRouter();

  return (
    <div className="flex min-h-96 h-screen justify-center place-items-center drop-shadow-lg text-center">
      <div className="p-10 space-y-1 flex flex-col h-2/3 w-1/2 bg-slate-50 place-items-center justify-around">
        <div className='opacity-100 text-4xl drop-shadow-sm'>
          Welcome
        </div>
        <div className="w-full py-[10%] flex-col ">
          <button className='w-1/2 h-1/2 mb-10 h-1/1 bg-sky-600 text-white rounded-full text-2xl' onClick={() => router.push('/signIn')}>
            Sign in
          </button>
          <div className='cursor-pointer underline text-sky-500' onClick={() => router.push('/createAccount')}>
            Create an account
          </div>
        </div>
      </div>
    </div>
  );
}