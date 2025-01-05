"use client";
import { useRouter } from 'next/navigation';
import TextInput from '@/components/TextInput';

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex min-h-96 h-screen justify-center place-items-center drop-shadow-lg text-center">
      <div className="p-10 space-y-1 flex flex-col h-3/6 w-1/2 bg-slate-50 place-items-center">
        <div className="w-2/3 h-1/6 flex flex-col">
          <TextInput placeholder='Email'/>
        </div>
        <div className="w-2/3 h-1/6 flex flex-col">
          <TextInput placeholder='Very Long Whatever'/>
        </div>
      </div>
    </div>
  );
}