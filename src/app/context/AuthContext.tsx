import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient, { publicClient } from '../services/api';

interface User {
    id: string;
    email: string;
    username?: string;
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
    emailVerified: boolean;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (identifier: string, password: string) => Promise<void>;
    signup: (data: any) => Promise<void>;
    logout: () => Promise<void>;
    setUsername: (username: string, password: string) => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check auth status on mount
    useEffect(() => {
        const initAuth = async () => {
            try {
                const response = await apiClient.get('/auth/me');
                setUser(response.data.user);
            } catch (error) {
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };
        initAuth();
    }, []);

    const login = async (identifier: string, password: string) => {
        const response = await publicClient.post('/auth/login', { identifier, password });
        setUser(response.data.user);
    };

    const signup = async (data: any) => {
        const response = await publicClient.post('/auth/signup', data);
        setUser(response.data.user);
    };

    const logout = async () => {
        try {
            await apiClient.post('/auth/logout');
        } catch (e) {
            // Ignore logout errors
        }
        setUser(null);
        window.location.href = '/signin';
    };

    const setUsername = async (username: string, password: string) => {
        const response = await apiClient.patch('/auth/username', { username, password });
        const { user } = response.data;
        setUser(user);
    };

    const refreshUser = async () => {
        try {
            const response = await apiClient.get('/auth/me');
            setUser(response.data.user);
        } catch (error) {
            console.error('Failed to refresh user:', error);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isLoading,
                login,
                signup,
                logout,
                setUsername,
                refreshUser, // ← ADDED THIS
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}