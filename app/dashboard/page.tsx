"use client";
import DashboardHeader from "@/components/DashboardHeader";
import PopUpMenu from "@/components/PopUpMenu";
import ThreeVerticalDots from "@/public/icons/threeVerticalDots.svg"
import Card from "@/components/Card";
import { useState } from "react";

export default function Dashboard() {
    const [currentTarget, setCurrentTarget] = useState<EventTarget & HTMLElement | undefined>(undefined);
    return (
        <>
            <DashboardHeader />
            <div className="flex flex-col mt-16">
                <div className="[&>.card]:drop-shadow-lg [&>.card]:bg-white [&>.card]:rounded-md [&>.card>.row>*>*]:py-3">
                    <Card>
                        <div className="grid grid-cols-4 items-center w-full font-bold bg-slate-100">
                            <div>Title</div>
                            <div>Submitted</div>
                            <div>Approved</div>
                        </div>
                        <div className="grid grid-cols-4 items-center w-full font-base bg-white">
                            <div>Winter Schedule 2024</div>
                            <div>1/6/2</div>
                            <div>Yes</div>
                            <div className="relative justify-self-end h-full aspect-square mr-8 flex justify-center cursor-pointer hover:bg-slate-100 rounded-full"
                                 onClick={(e) => { setCurrentTarget(e.currentTarget) }}>
                                <ThreeVerticalDots className="h-full aspect-square text-slate-500" />
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
            <PopUpMenu currentTarget={currentTarget} />
        </>
    );
}