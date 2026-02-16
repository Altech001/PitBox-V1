import React, { createContext, useContext, useEffect, useCallback } from 'react';
import { apiClient, setAuthToken, clearAuthToken, authEvents } from '@/lib/api/client';
import type { BodyLoginAuthLoginPost, UserCreate, UserResponse } from '@/lib/api/api';
import { toast } from 'sonner';
import { storage } from '@/lib/storage';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/hooks/use-auth-store';

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
    const queryClient = useQueryClient();
    
    // Connect to Zustand store actions
    const { user, isAuthenticated, isLoading, setAuth, clearAuth, setLoading, setUser } = useAuthStore();

    const fetchMe = useCallback(async () => {
        try {
            const response = await apiClient.auth.getMeAuthMeGet();
            setUser(response.data);
            storage.set("pitbox_premium", response.data.subscribed ? "true" : "false");
        } catch (error) {
            console.error("Profile sync failed", error);
            handleLogout();
        } finally {
            setLoading(false);
        }
    }, [setUser, setLoading]);

    const handleLogout = useCallback((isSessionExpired = false) => {
        clearAuthToken();
        storage.remove('pitbox_token');
        storage.remove('pitbox_premium');
        clearAuth();
        queryClient.clear();

        if (isSessionExpired) {
            toast.error('Session expired. Please login again.');
        }
    }, [clearAuth, queryClient]);

    // Initial Hydration
    useEffect(() => {
        const token = storage.get<string>('pitbox_token');
        if (token) {
            setAuthToken(token);
            fetchMe();
        } else {
            setLoading(false);
        }
    }, [fetchMe, setLoading]);

    // Listen for global 401 Unauthorized events from the API client
    useEffect(() => {
        const onUnauthorized = () => {
            if (isAuthenticated) handleLogout(true);
        };
        authEvents.addEventListener('unauthorized', onUnauthorized);
        return () => authEvents.removeEventListener('unauthorized', onUnauthorized);
    }, [isAuthenticated, handleLogout]);

    const login = async (data: BodyLoginAuthLoginPost) => {
        try {
            const response = await apiClient.auth.loginAuthLoginPost(data);
            const { access_token } = response.data;

            storage.set('pitbox_token', access_token);
            setAuthToken(access_token);
            
            // Set initial token in store; fetchMe will populate the user object next
            setAuth(null, access_token); 
            await fetchMe();
            
            toast.success('Welcome back!');
        } catch (error: any) {
            const message = error.error?.detail?.[0]?.msg || 'Login failed';
            toast.error(message);
            throw error;
        }
    };

    const register = async (data: UserCreate) => {
        try {
            await apiClient.auth.registerAuthRegisterPost(data);
            toast.success('Account created! Please sign in.');
        } catch (error: any) {
            toast.error(error.error?.detail || 'Registration failed');
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            isLoading, 
            login, 
            register, 
            logout: () => handleLogout(false), 
            isAuthenticated 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) throw new Error('useAuth must be used within AuthProvider');
    return context;
};