"use client";
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/components/AuthProvider';

export default function Home() {
  const user = useAuthContext();
  console.log(user);
  const router = useRouter();

  return (
    <div className="flex h-screen justify-center">
      <div className="relative w-1/4 flex flex-col place-items-center justify-center p-4 self-stretch">
        <button 
          type="button" 
          className="select-none cursor-pointer mt-1 block w-full px-3 py-2 bg-sky-500 border border-sky-400 rounded-md text-sm shadow-sm font-bold text-white
          hover:bg-sky-600 hover:border-sky-500 transition-all ease-in-out duration-200"
          onClick={() => router.push('/form')}>
          Get Started
        </button>
      </div>
    </div>
  );
}