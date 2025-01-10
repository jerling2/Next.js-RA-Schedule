"use client";
import Image from 'next/image';
import cogwheelIcon from '@/public/icons/cogwheel.svg';
import SmallButton from "./NextButton";
import { useRouter } from "next/navigation";
import { signOutUser } from '@/lib/client/auth';

interface DashboardHeaderProps {

}

export default function DashboardHeader({}: DashboardHeaderProps) {
    const router = useRouter();
    return (
        <div className="card flex flex-col justify-center place-items-end px-4 w-full h-[12%] min-h-[50px] bg-slate-50 drop-shadow-lg">
            <div className="flex flex-row place-items-center gap-x-5">
                <div className="[&>button]:p-1 [&>div]:p-1">
                    <SmallButton value="Sign out" onClick={()=>{signOutUser(); router.push("/")}}/>
                </div>
                <div className='settings w-10 hover:animate-spin cursor-pointer fill-sky-500'
                     onClick={() => router.push("/dashboard/settings")}>
                    <Image
                        src={cogwheelIcon} 
                        alt="Settings"
                    />
                </div>
            </div>
        </div>
    )
}