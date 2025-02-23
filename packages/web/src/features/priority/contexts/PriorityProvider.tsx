"use client";
import { useState, createContext } from 'react';


export const PriorityContext = createContext<PriorityContextType>(undefined);


export function PriorityProvider({ children }: {
    children: React.ReactNode;
}) {
    const [priorities, setPriorities] = useState<PrioritiesGlobal>({})
    
    const updatePriorities: UpdateGlobalPriorities = (key, value) => {
        setPriorities((prev) => ({
            ...prev,
            [key]: value instanceof Function
                ? value(prev[key])
                : value
        }));
    }

    return (
        <PriorityContext.Provider value={{
            'globalPriorities': priorities, 
            'updateGlobalPriorities': updatePriorities
        }}>
            {children}
        </PriorityContext.Provider>
    );
}