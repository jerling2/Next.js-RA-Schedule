"use client";
import { DashboardHeader } from "@/dashboard";
import { useRouter } from "next/navigation";
import PlusSign from "@/public/icons/plusSign.svg";

export default function Dashboard() {
    const router = useRouter();
    const display = false; //< Later change this to either show dashboard to new users or dashboard to returning users.

    return (
        <div className="relative flex flex-col w-screen h-screen [&>*]:px-dynamic-container">
            <DashboardHeader />
            {!display && 
            <div className="relative flex h-full min-w-fit justify-center items-center">
                <div className="z-0 absolute flex w-[300px] rounded-full aspect-square shadow-strobe bg-transparent animate-slow-spin" />
                <div className="z-10 flex flex-col items-center min-w-[350px] justify-center bg-background-2  aspect-square shadow-direct rounded-[24px]">
                    <div className="font-bold text-4xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                        Get Started
                    </div>
                    <PlusSign className="w-[44px] aspect-square mt-28 bg-clip text-primary hover:bg-accent-hover cursor-pointer rounded-full"
                    onClick={()=>router.push("dashboard/document")}/>
                </div>
            </div>}
        </div>
    );
}