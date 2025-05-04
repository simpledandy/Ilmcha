// src/providers/AuthProvider.tsx
import React, { createContext, useState, useEffect } from 'react';
import { router } from 'expo-router';
import { storage } from '@utils/storage';

interface User {
  name?: string;
  email: string;
  needsOnboarding?: boolean; // Add this field
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  completeOnboarding: () => Promise<void>; // Add this method
}

interface AuthError {
  code?: string;
  message: string;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  // Check for existing session on app load
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const userData = await storage.getUserData();
      const token = await storage.getAuthToken();
  
      if (userData && token) {
        setUser(userData);
        setIsAuthenticated(true);
  
        // Redirect based on onboarding status
        if (userData.needsOnboarding) {
          router.replace('/(app)/onboarding');
        } else {
          router.replace('/(app)');
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const mockUser = { email, needsOnboarding: false }; // Assume already onboarded for login
      const mockToken = 'mock_token_' + Date.now();
      await storage.setUserData(mockUser);
      await storage.setAuthToken(mockToken);
      setUser(mockUser);
      setIsAuthenticated(true);
      router.replace('/(app)');
    } catch (error) {
      throw {
        message: error instanceof Error ? error.message : 'An unknown error occurred during login.',
        code: 'LOGIN_ERROR',
      } as AuthError;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: AuthError }> => {
    try {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const mockUser = { name, email, needsOnboarding: true }; // New users need onboarding
      const mockToken = 'mock_token_' + Date.now();
      await storage.setUserData(mockUser);
      await storage.setAuthToken(mockToken);
      setUser(mockUser);
      setIsAuthenticated(true);
  
      // Re-check auth to trigger the correct redirection
      await checkAuth();
  
      return { success: true };
    } catch (err) {
      const error: AuthError = {
        code: "SIGNUP_ERROR",
        message: err.message || "An unknown error occurred",
      };
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const completeOnboarding = async () => {
    try {
      if (user) {
        const updatedUser = { ...user, needsOnboarding: false };
        await storage.setUserData(updatedUser);
        setUser(updatedUser);
        router.replace('/(app)');
      }
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
    }
  };

  const logout = async () => {
    try {
      await storage.clearAuth();
      setUser(null);
      setIsAuthenticated(false);
      router.replace('/(auth)');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (isLoading) {
    return null;
  }

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