"use client";
import { useEffect, useRef, useState } from 'react';
import { useRouter } from "next/navigation";
import { SmallButton, PopUpMenu } from "@/ui";
import { deleteUser } from "firebase/auth";
import { signOutUser } from '@/client/auth';
import { useAuthContext } from '@/auth';
import { Avatar } from '@/dashboard';


export function DashboardHeader() {
    const router = useRouter();
    const iconRef = useRef<HTMLDivElement | null>(null);
    const [currentTarget, setCurrentTarget] = useState<EventTarget & HTMLElement | undefined>(undefined);
    const [avatarOutline, setAvatarOutline] = useState<boolean>(false);
    const [deleteAccount, setDeleteAccount] = useState<number>(0);
    const [deleteMessage, setDeleteMessage] = useState<string>('Delete Account');
    const { user } = useAuthContext();

    const handleAccountDelete = () => {
        setDeleteAccount((prev) => {
            return (prev+1);
        });
    }

    const handleOnRender = (render: boolean) => {
        if (!render) {
            setCurrentTarget(undefined);
            setAvatarOutline(false);
            setDeleteAccount(0);
        }
    }

    useEffect(() => {
        if (currentTarget === iconRef.current) {
            setAvatarOutline(true);
        }
    }, [iconRef, currentTarget]);

    useEffect(() => {
        if (deleteAccount === 0) {
            setDeleteMessage("Delete Account");
        } else if (deleteAccount === 1) {
            setDeleteMessage("Sure?");
        } else if (deleteAccount === 2) {
            if (user === null) {
                return router.push("/signIn/userIdentifier");
            } 
            deleteUser(user);
            signOutUser();
            router.push("/");
        }
    }, [user, deleteAccount, router])

    return (
        <>
        <div className="relative flex items-center justify-end bg-background-2 w-full min-h-[40px] aspect-[24/1] shadow-dashboard-header">
            <Avatar ref={iconRef} focused={avatarOutline} onTarget={setCurrentTarget}/>
        </div>
        <div className='z-20 static [&>*]:py-4 [&>*]:px-2 [&>*]:bg-background-2 [&>*]:shadow-popup'>
            <PopUpMenu offsetX={0} offsetY={48} currentTarget={currentTarget} onRender={handleOnRender}>
                <div className='text-black px-1 [&>*]:text-base bg-primary hover:bg-primary-hover min-w-[80px] aspect-[3/1] rounded-full transition transition-all duration-200'>
                    <SmallButton value="Sign Out" onClick={()=>{signOutUser(); router.push("/")}}/>
                </div>
                <div className='text-black px-1 mt-4 [&>*]:text-base text-black font-bold bg-invalid hover:bg-invalid-hover min-w-[130px] aspect-[3/1] rounded-full transition transition-all duration-200'>
                    <SmallButton value={deleteMessage} onClick={handleAccountDelete}/>
                </div>
            </PopUpMenu>
        </div>
        </>
    )
}