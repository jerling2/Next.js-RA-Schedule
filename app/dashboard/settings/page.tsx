"use client";
import { useRef, useState } from "react";
import { useAuthContext } from "@/components/AuthProvider";
import { deleteUser } from "firebase/auth";
import { signOutUser } from "@/lib/client/auth";
import { useRouter } from "next/navigation";
import DashboardHeader from "@/components/DashboardHeader";

export default function DashboardSettings () {
    const router = useRouter();
    const areYouSure = useRef<number>(0);
    const { user } = useAuthContext();
    const [deleteAccountPlaceholder, setDeleteAccountPlaceholder] = useState<string>("Delete account");

    const handleAreYouSure = () => {
        areYouSure.current++;
        setDeleteAccountPlaceholder("Click again to delete your account");
        if (areYouSure.current > 1) {
            if (user === null) {
                return router.push("/signIn/userIdentifier");
            } 
            deleteUser(user);
            signOutUser();
            router.push("/");
        }
    }

    return (
        <>
        <DashboardHeader currentPage="settings" />
        <div className="relative flex flex-row justify-center w-full">
            <div className="flex flex-col w-[78%] mt-5">
                <h1 className="text-2xl mb-5 font-bold">
                    Settings
                </h1>
                <button className="w-fit bg-rose-600 hover:bg-rose-700 text-white font-bold p-2 rounded-full"
                        onClick={() => handleAreYouSure()}>
                    {deleteAccountPlaceholder}
                </button>
            </div>
        </div>
        </>
    );
}