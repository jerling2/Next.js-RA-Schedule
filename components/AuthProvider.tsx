"use client";
import { createContext, useEffect, useState, ReactNode, useContext } from 'react';
import { auth } from "@/lib/client/auth";
import { onAuthStateChanged, User } from 'firebase/auth';

interface AuthContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    loading: boolean;
    setLoading: (isLoading: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: Readonly<{children: ReactNode}>) => {
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

export const useAuthContext = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuthContext must be used within a AuthProvider');
    }
    return context;
}