import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiClient, setAuthToken, clearAuthToken, authEvents } from '@/lib/api/client';
import type { UserResponse, BodyLoginAuthLoginPost, UserCreate } from '@/lib/api/api';
import { toast } from 'sonner';
import { storage } from '@/lib/storage';
import { useQueryClient } from '@tanstack/react-query';

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
    const queryClient = useQueryClient();

    const fetchMe = useCallback(async () => {
        try {
            const response = await apiClient.auth.getMeAuthMeGet();
            setUser(response.data);
            // Sync legacy storage for compatibility if needed
            storage.set("pitbox_premium", response.data.subscribed ? "true" : "false");
        } catch (error) {
            console.error("Failed to fetch user profile", error);
            // Don't call logout() here to avoid loops, just clear local state
            clearAuthToken();
            storage.remove('pitbox_token');
            storage.remove('pitbox_premium');
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        // Initialize session from storage
        const token = storage.get<string>('pitbox_token');
        if (token) {
            setAuthToken(token);
            fetchMe();
        } else {
            setIsLoading(false);
        }
    }, [fetchMe]);

    // Interceptor Listener: Handle global 401s
    useEffect(() => {
        const handleUnauthorized = () => {
            // Only trigger if we think we are logged in, to avoid double-toasts
            const token = storage.get<string>('pitbox_token');
            if (token) {
                logout(true); // Pass true to indicate this was a forced session expiry
            }
        };

        authEvents.addEventListener('unauthorized', handleUnauthorized);
        return () => {
            authEvents.removeEventListener('unauthorized', handleUnauthorized);
        };
    }, []);

    const login = async (data: BodyLoginAuthLoginPost) => {
        try {
            const response = await apiClient.auth.loginAuthLoginPost(data);
            const { access_token } = response.data;

            storage.set('pitbox_token', access_token);
            setAuthToken(access_token);

            await fetchMe();
            toast.success('Welcome back!');
        } catch (error: any) {
            const message = error.error?.detail?.[0]?.msg ||
                error.error?.detail ||
                'Login failed. Please check your credentials.';
            toast.error(message);
            throw error;
        }
    };

    const register = async (data: UserCreate) => {
        try {
            await apiClient.auth.registerAuthRegisterPost(data);
            toast.success('Account created! You can now login.');
        } catch (error: any) {
            const message = error.error?.detail?.[0]?.msg ||
                error.error?.detail ||
                'Registration failed. Please try again.';
            toast.error(message);
            throw error;
        }
    };

    const logout = (isSessionExpired = false) => {
        clearAuthToken();
        storage.remove('pitbox_token');
        storage.remove('pitbox_premium');
        setUser(null);

        // Clear all server state to prevent next user from seeing old data
        queryClient.clear();

        if (isSessionExpired) {
            toast.error('Session expired. Please login again.');
        } else {
            toast.info('Logged out');
        }
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