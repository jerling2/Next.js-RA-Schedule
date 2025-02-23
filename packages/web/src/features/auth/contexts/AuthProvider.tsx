"use client";
import { createContext, useEffect, useState, ReactNode } from 'react';
import { auth } from "@/client/firebase";
import { onAuthStateChanged, User } from 'firebase/auth';


export const AuthContext = createContext<AuthContextType | undefined>(undefined);


export function AuthProvider({ children }: Readonly<{children: ReactNode}>) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setLoading(true);
            if (user) {
                setUser(user);
            } else {
                // user is signed out.
                setUser(null);
            }
            setLoading(false);
        });
        return () => {
            unsubscribe();
        };
    }, []);

    return (
        <AuthContext.Provider value={{user, setUser, loading, setLoading}}>
            {children}
        </AuthContext.Provider>
    )
}

