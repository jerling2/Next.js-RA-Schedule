"use client"
import { useState, createContext, useContext, ReactNode, useEffect } from 'react';

interface EmailContextType {
    email: string;
    setEmail: (email: string) => void;
}

const EmailContext = createContext<EmailContextType | undefined>(undefined);


export default function EmailContextProvider({ children }: Readonly<{children: ReactNode}>) {
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

const useEmailContext = (): EmailContextType  => {
    const context = useContext(EmailContext);
    if (context === undefined) {
        throw new Error("useSignInContext must be used within a SignInContextProvider");
    }
    return context;
}

export { useEmailContext };