"use client";
import { useState, createContext } from "react";


export const PriorityClipboardContext = createContext<PriorityClipboardContext>({
    priorityClipboard: undefined,
    setPriorityClipboard: undefined
});


export function PriorityClipboardProvider({ children }: {
    children: React.ReactNode;
}) {
    const [priorityClipboard, setPriorityClipboard] = useState<PriorityClipboard>({})
    return (
        <PriorityClipboardContext.Provider value={{
            'priorityClipboard': priorityClipboard, 
            'setPriorityClipboard': setPriorityClipboard
        }}>
            {children}
        </PriorityClipboardContext.Provider>
    );
}