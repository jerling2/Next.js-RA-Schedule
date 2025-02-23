"use client";
import { useContext } from "react";
import { KeyboardContext } from "@/ui";


export const useKeyboardContext = (): KeyboardState => {
    const keyboardContext = useContext(KeyboardContext);
    if (keyboardContext === undefined) {
        throw new Error("useKeyboardContext must be used inside a KeyboardContextProvider");
    }
    return keyboardContext;
}