"use client";
import { useState, createContext, ReactNode, useEffect } from 'react';


export const EmailContext = createContext<EmailContextType | undefined>(undefined);


export function EmailContextProvider({ children }: Readonly<{children: ReactNode}>) {
    const [email, setEmail] = useState<string>('');

    useEffect(() => {
        const sessionEmail = sessionStorage.getItem('user-identifier');
        if (email === '' && sessionEmail !== null) {
            setEmail(sessionEmail);
        } else {
            sessionStorage.setItem("user-identifier", email);
        }
        return () => {
            sessionStorage.removeItem("user-identifier");
        };
    }, [email]);

    return (
        <EmailContext.Provider value={{email, setEmail}}>
            {children}
        </EmailContext.Provider>
    )
}