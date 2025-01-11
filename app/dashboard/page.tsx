"use client";
import DashboardHeader from "@/components/DashboardHeader";
import PopUpMenu from "@/components/PopUpMenu";
import ThreeVerticalDots from "@/public/icons/threeVerticalDots.svg"
import Card from "@/components/Card";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Done from "@/public/icons/done.svg";
import Pending from "@/public/icons/pending.svg";
import CreatePage from "@/public/icons/createPage.svg";

export default function Dashboard() {
    const router = useRouter();
    const [currentTarget, setCurrentTarget] = useState<EventTarget & HTMLElement | undefined>(undefined);
    const [approvalStatus, setApprovalStatus] = useState<string>("approved");
    const [display, setDisplay] = useState<boolean>(true);

    const handlePopUpMenuRender = (render: boolean) => {
        if (!render) {
            setCurrentTarget(undefined);
        }
    }

    return (
        <>
            <DashboardHeader />
            {!display && <>
                <div className="relative mt-16 [&>.card]:drop-shadow-lg [&>.card]:bg-white [&>.card]:rounded-md [&>.card>.row>*>*]:py-3">
                <Card>
                    <div className="flex flex-row justify-center w-full text-lg font-bold bg-slate-100">
                        <div>Get Started</div>
                    </div>
                    <div className="flex flex-row justify-center items-center w-full font-bold bg-white h-24">
                        <div className="relative p-2 hover:bg-slate-100 rounded-full aspect-square h-full cursor-pointer active:bg-slate-200"
                            onClick={()=>router.push("dashboard/document")}>
                            <CreatePage className="relative text-sky-500 left-2 h-full aspect-square"/>
                        </div>
                    </div>
                </Card>
            </div>
            
            </>}
            
            {display && <>
            <div className="relative flex flex-col mt-16">
                <div className="[&>.card]:drop-shadow-lg [&>.card]:bg-white [&>.card]:rounded-md [&>.card>.row>*>*]:py-3">
                    <Card>
                        <div className="grid grid-cols-4 items-center w-full font-bold bg-slate-100">
                            <div>Title</div>
                            <div>Submitted</div>
                            <div>Approval Status</div>
                        </div>
                        <div className="grid grid-rows-[3rem] grid-cols-4 items-center w-full font-base bg-white">
                            <div>Winter Term 2025</div>
                            <div>1/6/2</div>
                            <div className="relative h-full justify-self-start flex items-center justify-start aspect-square">
                                {approvalStatus==="pending" && <>
                                <Pending className="h-full aspect-square text-yellow-500"/>
                                <div className="ml-2 text-sm font-bold text-yellow-500">
                                    Pending
                                </div>
                                </>}
                                {approvalStatus==="approved" && <>
                                <Done className="h-full aspect-square text-green-500"/>
                                <div className="ml-2 text-sm font-bold text-green-500">
                                    Approved
                                </div>
                                </>}
                            </div>
                            <div className="relative justify-self-end h-full aspect-square mr-8 flex justify-center cursor-pointer hover:bg-slate-100 rounded-full"
                                 onClick={(e) =>setCurrentTarget(e.currentTarget)}>
                                <ThreeVerticalDots className="h-full aspect-square text-slate-500" />
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
            <PopUpMenu currentTarget={currentTarget} onRender={handlePopUpMenuRender}
            offsetX={10} offsetY={20}>
                <div className="bg-purple-50 hover:bg-purple-100 active:bg-purple-200 cursor-pointer"
                     onClick={()=>console.log("clicked on edit!")}>
                    Edit
                </div>
            </PopUpMenu>
            </>}
        </>
    );
}