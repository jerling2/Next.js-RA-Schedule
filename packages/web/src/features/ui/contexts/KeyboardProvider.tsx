"use client";
import { NativeKeyboardEvent } from '@/constants';
import { useState, createContext, ReactNode, useEffect } from 'react';


export const KeyboardContext = createContext<KeyboardState | undefined>(undefined);


export function KeyboardProvider({ children }: Readonly<{children: ReactNode}>) {
    const [keyboardState, setKeyboardState] = useState<KeyboardState>({
        shift: false
    })
    
    const handleKeyUp = (e: NativeKeyboardEvent) => {
        if (e.key === "Shift") {
            setKeyboardState((prev) => {
                const newKeyboardState = {...prev};
                newKeyboardState['shift'] = false;
                return newKeyboardState;
            })
        }
    }

    const handleKeyDown = (e: NativeKeyboardEvent) => {
        if (e.key === "Shift") {
            setKeyboardState((prev) => {
                const newKeyboardState = {...prev};
                newKeyboardState['shift'] = true;
                return newKeyboardState;
            })
        }
    }
    
    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        }
    }, []);

    return (
        <KeyboardContext.Provider value={keyboardState}>
            {children}
        </KeyboardContext.Provider>
    )
}