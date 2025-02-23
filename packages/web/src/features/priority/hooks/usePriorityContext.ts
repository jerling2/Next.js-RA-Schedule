"use client";
import { useContext } from "react";
import { PriorityContext } from "@/priority"


export const usePriorityContext: UsePriorityContext = () => {
    const context = useContext(PriorityContext);
    if (context === undefined) {
        throw new Error('usePriorityContext must be used within a PriorityProvider');
    }
    const { globalPriorities, updateGlobalPriorities } = context;

    const updatePriorities: UpdatePriorities = (key, blockIdx, value) => {
        updateGlobalPriorities(key, (prev) => ({
            ...prev,
            [blockIdx]: value instanceof Function
                ? value(prev[blockIdx])
                : value
        }));
    }

    return [ globalPriorities, updatePriorities ];
}