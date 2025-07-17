// src/providers/AuthProvider.tsx
import React, { createContext, useState, useEffect } from 'react';
import { router } from 'expo-router';
import { storage } from '../utils/storage';
import { signIn, signUp, supabase } from '../utils/supabaseClient'; // <-- import your Supabase helpers

interface AuthProviderProps {
  children: React.ReactNode;
  navigationReady: boolean;
}

interface User {
  name?: string;
  email: string;
  needsOnboarding?: boolean;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
}

interface AuthError {
  code?: string;
  message: string;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children, navigationReady }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  const checkAuth = async () => {
    try {
      const session = supabase.auth.getSession ? (await supabase.auth.getSession()).data.session : null;
      if (session && session.user) {
        setUser({ email: session.user.email ?? '', needsOnboarding: false });
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (navigationReady) {
      checkAuth();
    }
  }, [navigationReady]);

  useEffect(() => {
    if (navigationReady && isAuthenticated && user) {
      if (user.needsOnboarding) {
        router.replace('/(app)/onboarding');
      } else {
        router.replace('/(app)');
      }
    }
  }, [isAuthenticated, user, navigationReady]);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      const { user: supaUser, error } = await signIn(email, password);
      if (error || !supaUser) throw error || new Error('No user returned');
      setUser({ email: supaUser.email ?? '', needsOnboarding: false });
      setIsAuthenticated(true);
      // Optionally store session/token if you want
    } catch (error: any) {
      throw {
        message: error?.message || 'An unknown error occurred during login.',
        code: 'LOGIN_ERROR',
      } as AuthError;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const { user: supaUser, error } = await signUp(email, password);
      if (error || !supaUser) throw error || new Error('No user returned');
      setUser({ name, email: supaUser.email ?? '', needsOnboarding: true });
      setIsAuthenticated(true);
      return { success: true };
    } catch (err: any) {
      const error: AuthError = {
        code: "SIGNUP_ERROR",
        message: err?.message || "An unknown error occurred",
      };
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const completeOnboarding = async () => {
    try {
      if (user) {
        const updatedUser = { ...user, needsOnboarding: false };
        setUser(updatedUser);
        router.replace('/(app)');
      }
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setIsAuthenticated(false);
      router.replace('/(auth)');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        isLoading,
        login,
        signup,
        logout,
        completeOnboarding,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}