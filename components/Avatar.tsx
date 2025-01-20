"use client";

import type { Ref } from 'react';

interface AvatarProps {
    ref?: Ref<HTMLDivElement>;
    focused?: boolean;
    onTarget?: (event: EventTarget & HTMLElement | undefined) => void;
}

export default function Avatar({ref=null, focused=false, onTarget=()=>{}}: AvatarProps) {
    return (
        <div ref={ref}
        className={`${focused ? 'outline-background-3 shadow-icon': ''} flex justify-center items-center w-[40px] h-[40px] bg-primary rounded-full overflow-hidden text-black cursor-pointer outline  outline-transparent outline-[4px] hover:outline-background-3 duration-300 transition-all hover:shadow-icon`}
        onClick={(e) => onTarget(e.currentTarget)}>
            <div className='select-none'>
                RA
            </div>
        </div>
    )
}