"use client";
import { useContext } from "react";
import { EmailContext } from "@/auth";


export const useEmailContext = (): EmailContextType  => {
    const context = useContext(EmailContext);
    if (context === undefined) {
        throw new Error("useSignInContext must be used within a SignInContextProvider");
    }
    return context;
}