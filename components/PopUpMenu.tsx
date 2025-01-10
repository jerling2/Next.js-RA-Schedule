"use client";

import { useState, useEffect } from "react";

interface PopUpMenuProps {
    currentTarget?: EventTarget & HTMLElement  | undefined;
}

export default function PopUpMenu({ currentTarget = undefined }: PopUpMenuProps) {
    const [optCoords, setOptCoords] = useState<number[]>([0,0]);

    useEffect(() => {
        if (currentTarget === undefined) {
            return;
        } else if (currentTarget === null) {
            throw new Error("currentTarget was null. It could be that the currentTarget was \
            accessed outside the HTMLElement's event handler.")
        }
        const rect = currentTarget.getBoundingClientRect();
        const top = rect.top + window.scrollY;
        const left = rect.left + window.scrollX;
        setOptCoords([top, left]);
    }, [currentTarget]);

    return (
        <div style={{
            top: `${optCoords[0]}px`,
            left: `${optCoords[1]}px`
        }}
        className='absolute w-[100px] aspect-square bg-red-500'/>
    );
}