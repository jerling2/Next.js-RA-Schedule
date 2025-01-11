"use client";
import { useState } from 'react';
import { TailSpin } from 'react-loader-spinner';

interface NextButtonProps {
    isLoading?: boolean;
    onClick?: () => void;
    value?: string;
}
export default function SmallButton({ value="Next", isLoading=false, onClick=()=>{} }: NextButtonProps) {
    if (!isLoading) {
        return (
            <button className="flex w-full h-full place-items-center justify-center border-box
            rounded-full
            select-none cursor-pointer
            text-inherit text-lg font-bold
            transition-all"
            onClick={() => onClick()}>
                {value}
            </button>
        );
    } else {
        return (
            <div className="flex w-full h-full place-items-center justify-center border-box
            rounded-full
            select-none cursor-default">
                <TailSpin
                color={'#FFFFFF'}
                height={30} />
            </div>
        );
    }
}