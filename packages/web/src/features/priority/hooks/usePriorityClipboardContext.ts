"use client";
import { useContext } from "react";
import { PriorityClipboardContext } from "@/priority";


export const usePriorityClipboardContext = (): UsePriorityClipboardContext => {
    const { priorityClipboard, setPriorityClipboard } = useContext(PriorityClipboardContext);

    const updatePriorityClipboard: UpdatePriorityClipboard = (value) => {
        setPriorityClipboard(value);
    }

    if (priorityClipboard === undefined || setPriorityClipboard === undefined) {
        throw new Error("Cannot use the priority clipboard context outside a PriorityClipboardProvider");
    }
    return [priorityClipboard, updatePriorityClipboard];
}