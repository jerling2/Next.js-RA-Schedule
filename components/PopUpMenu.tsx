"use client";

type NativeMouseEvent = MouseEvent;
import { useState, useRef, useEffect } from "react";
import type { ReactNode } from "react";

interface PopUpMenuProps {
    currentTarget?: EventTarget & HTMLElement  | undefined;
    offsetX?: number;
    offsetY?: number;
    onRender: (render: boolean) => void;
    children: ReactNode,

}

export default function PopUpMenu({ 
    currentTarget=undefined, offsetX=0, offsetY=0, onRender, children 
}: PopUpMenuProps
) {
    const menuRef = useRef<HTMLDivElement | null>(null);
    const [optCoords, setOptCoords] = useState<number[]>([0,0]);
    const [render, setRender] = useState<boolean>(false);

    const handleClick = (event: NativeMouseEvent) => {
        if (render === false || menuRef.current === null) {
            return;
        }
        const clickX = event.clientX;
        const clickY = event.clientY;
        const rect = menuRef.current.getBoundingClientRect();
        const menuX = rect.left + window.scrollX;
        const menuY = rect.top + window.scrollY;
        const menuW = rect.width;
        const menuH = rect.height;
        if (clickX < menuX || clickY < menuY || clickX > menuX + menuW || clickY > menuY + menuH) {
            return setRender(false);
        }
    }

    useEffect(() => {
        document.addEventListener('click', handleClick);
        onRender(render);
        return () => {
          document.removeEventListener('click', handleClick);
        };
    }, [render, handleClick, onRender]);

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
        setRender(true);
    }, [currentTarget]);

    return (
        <>
        {render && 
        <div
            ref={menuRef}           
            style={{
                top: `${optCoords[0]+offsetY}px`,
                left: `${optCoords[1]+offsetX}px`
            }}
            className='absolute rounded-md'>
            <div className="relative">
                {children}
            </div>
        </div>}
        {!render && <></>}
        </>
    );
}