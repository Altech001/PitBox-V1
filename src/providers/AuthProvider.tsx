import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient, setAuthToken, clearAuthToken } from '@/lib/api';
import type { UserResponse, BodyLoginAuthLoginPost, UserCreate } from '@/lib/api';
import { toast } from 'sonner';

interface AuthContextType {
    user: UserResponse | null;
    isLoading: boolean;
    login: (data: BodyLoginAuthLoginPost) => Promise<void>;
    register: (data: UserCreate) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<UserResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchMe = async () => {
        try {
            const response = await apiClient.auth.getMeAuthMeGet();
            setUser(response.data);
            // For legacy compatibility with existing ProtectedRoute in App.tsx
            localStorage.setItem("pitbox_premium", response.data.subscribed ? "true" : "false");
        } catch (error) {
            clearAuthToken();
            localStorage.removeItem('pitbox_token');
            localStorage.removeItem('pitbox_premium');
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('pitbox_token');
        if (token) {
            setAuthToken(token);
            fetchMe();
        } else {
            setIsLoading(false);
        }
    }, []);

    const login = async (data: BodyLoginAuthLoginPost) => {
        try {
            const response = await apiClient.auth.loginAuthLoginPost(data);
            const { access_token } = response.data;

            localStorage.setItem('pitbox_token', access_token);
            setAuthToken(access_token);

            await fetchMe();
            toast.success('Welcome back!');
        } catch (error: any) {
            const message = error.error?.detail?.[0]?.msg || error.error?.detail || 'Login failed. Please check your credentials.';
            toast.error(message);
            throw error;
        }
    };

    const register = async (data: UserCreate) => {
        try {
            await apiClient.auth.registerAuthRegisterPost(data);
            toast.success('Account created! You can now login.');
        } catch (error: any) {
            const message = error.error?.detail?.[0]?.msg || error.error?.detail || 'Registration failed. Please try again.';
            toast.error(message);
            throw error;
        }
    };

    const logout = () => {
        clearAuthToken();
        localStorage.removeItem('pitbox_token');
        localStorage.removeItem('pitbox_premium');
        setUser(null);
        toast.info('Logged out');
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, register, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
