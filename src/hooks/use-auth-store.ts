import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserResponse } from '@/lib/api/api';
import { storage } from '@/lib/storage';

interface AuthState {
  user: UserResponse | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  setAuth: (user: UserResponse | null, token: string | null) => void;
  setLoading: (loading: boolean) => void;
  setUser: (user: UserResponse | null) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,

      setAuth: (user, token) => set({ 
        user, 
        token, 
        isAuthenticated: !!token, 
        isLoading: false 
      }),

      setLoading: (isLoading) => set({ isLoading }),

      setUser: (user) => set({ user, isAuthenticated: !!user }),

      clearAuth: () => set({ 
        user: null, 
        token: null, 
        isAuthenticated: false, 
        isLoading: false 
      }),
    }),
    {
      name: 'pitbox-auth-state',
      // Store only the essential session data
      partialize: (state) => ({ 
        token: state.token, 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);