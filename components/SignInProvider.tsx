"use client"
import { useState, createContext, useContext, ReactNode, useEffect } from 'react';

interface SignInContextType {
    email: string;
    setEmail: (email: string) => void;
}

const SignInContext = createContext<SignInContextType | undefined>(undefined);


export default function SignInContextProvider({ children }: Readonly<{children: ReactNode}>) {
    const [email, setEmail] = useState<string>(() => {
        const sessionEmail = sessionStorage.getItem('user-identifier');
        return sessionEmail ? sessionEmail : "";
    });

    useEffect(() => {
        sessionStorage.setItem("user-identifier", email);
        return () => {
            sessionStorage.removeItem("user-identifier");
        };
    }, [email]);

    return (
        <SignInContext.Provider value={{email, setEmail}}>
            {children}
        </SignInContext.Provider>
    )
}

const useSignInContext = (): SignInContextType  => {
    const context = useContext(SignInContext);
    if (context === undefined) {
        throw new Error("useSignInContext must be used within a SignInContextProvider");
    }
    return context;
}

export { useSignInContext };