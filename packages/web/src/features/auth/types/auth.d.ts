interface AuthContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    loading: boolean;
    setLoading: (isLoading: boolean) => void;
}