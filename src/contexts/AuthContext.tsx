import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
    email: string;
}

interface AuthContextData {
    user: User | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    signUp: (name: string, email: string, password: string) => Promise<void>;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadStorageData() {
            const storedUser = await AsyncStorage.getItem('@AuthData:user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
            setLoading(false);
        }
        loadStorageData();
    }, []);

    const signIn = async (email: string, password: string) => {
        if (email && password) {
            const userData = { email };
            await AsyncStorage.setItem('@AuthData:user', JSON.stringify(userData));
            setUser(userData);
        } else {
            throw new Error('Invalid credentials');
        }
    };

    const signOut = async () => {
        await AsyncStorage.removeItem('@AuthData:user');
        setUser(null);
    };

    const signUp = async (name: string, email: string, password: string) => {
        if (name && email && password) {
            const userData = { email };
            await AsyncStorage.setItem('@AuthData:user', JSON.stringify(userData));
            setUser(userData);
        } else {
            throw new Error('Invalid credentials');
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, signIn, signOut, signUp, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}