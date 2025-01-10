"use client";
import CogWheelIcon from '@/public/icons/cogwheel.svg';
import HomeIcon from '@/public/icons/homeIcon.svg';
import SmallButton from "./NextButton";
import { useRouter } from "next/navigation";
import { signOutUser } from '@/lib/client/auth';


interface DashboardHeaderProps {
    currentPage?: string;
}

export default function DashboardHeader({currentPage="home"}: DashboardHeaderProps) {
    const router = useRouter();
    return (
        <div className="card flex flex-col justify-center place-items-end px-4 w-full h-[12%] min-h-[50px] bg-slate-50 drop-shadow-lg">
            <div className="flex flex-row place-items-center gap-x-5">
                <div className="[&>button]:p-1 [&>div]:p-1">
                    <SmallButton value="Sign out" onClick={()=>{signOutUser(); router.push("/")}}/>
                </div>
                {currentPage === "home" && <CogWheelIcon className='w-10 h-10 hover:animate-spin cursor-pointer text-sky-500'
                     onClick={() => router.push("/dashboard/settings")} />}
                {currentPage === "settings" && <HomeIcon className='w-10 h-10 hover:animate-pulse cursor-pointer text-sky-500'
                     onClick={() => router.push("/dashboard")} />}
            </div>
        </div>
    )
}