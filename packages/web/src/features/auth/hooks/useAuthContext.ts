"use client";
import { useContext } from "react";
import { AuthContext } from "@/auth";


export const useAuthContext = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuthContext must be used within a AuthProvider');
    }
    return context;
}