"use client";
import Image from 'next/image';
import cogwheelIcon from '@/public/icons/cogwheel.svg';
import homeIcon from '@/public/icons/homeIcon.svg';
import SmallButton from "./NextButton";
import { useRouter } from "next/navigation";
import { signOutUser } from '@/lib/client/auth';

interface DashboardHeaderProps {

}

export default function DashboardHeader({}: DashboardHeaderProps) {
    const router = useRouter();
    return (
        <div className="flex flex-col justify-center place-items-end px-4 w-screen h-[12%] min-h-[50px] bg-slate-50 drop-shadow-lg">
            <div className="flex flex-row place-items-center gap-x-5">
                <div className="[&>button]:p-1 [&>div]:p-1">
                    <SmallButton value="Sign out" onClick={()=>{signOutUser(); router.push("/")}}/>
                </div>
                <div className='settings w-10 hover:animate-spin cursor-pointer'
                     onClick={() => router.push("/dashboard/settings")}>
                    <Image
                        src={cogwheelIcon} 
                        alt="Settings"
                    />
                </div>
                <div className='settings w-10 cursor-pointer hover:animate-pulse'
                     onClick={() => router.push("/dashboard")}>
                    <Image
                        src={homeIcon} 
                        alt="home"
                    />
                </div>
            </div>

        </div>
    )
}