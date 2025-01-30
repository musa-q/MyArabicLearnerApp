import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from 'react-native';
import { User, AuthContextType } from '../types';
import { authManager } from '../utils/authManager';

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            try {
                const email = await AsyncStorage.getItem('email');
                if (email && await authManager.initializeFromStorage()) {
                    setUser({ email });
                }
            } catch (error) {
                console.error('Auth initialization error:', error);
            } finally {
                setIsLoading(false);
            }
        };

        initAuth();

        authManager.setupAxiosInterceptors(() => {
            setUser(null);
        });

        return () => {
        };
    }, []);

    const login = async (token: string, refreshToken: string, email: string) => {
        await authManager.setTokens(token, refreshToken, email);
        setUser({ email });
    };

    const logout = async () => {
        await authManager.clearTokens();
        setUser(null);
    };

    if (isLoading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};