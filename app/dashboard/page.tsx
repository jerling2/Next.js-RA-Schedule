"use client";
import DashboardHeader from "@/components/DashboardHeader";
import Card from "@/components/Card";

export default function Dashboard() {
    return (
        <>
            <DashboardHeader />
            <div className="flex flex-col mt-16">
                <div className="[&>.card]:drop-shadow-lg [&>.card]:bg-white [&>.card]:rounded-md [&>.card>.row>*]:py-3">
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
                            <div className="justify-self-end pr-16">Yes</div>
                        </div>
                    </Card>
                </div>
            </div>

        </>
    );
}