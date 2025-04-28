import React, { createContext, useState, useEffect } from 'react';
import { router } from 'expo-router';
import { storage } from '@utils/storage';

interface User {
  name?: string;
  email: string;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
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
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Delay navigation until the app is mounted
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      setTimeout(() => {
        router.replace('/(app)/home');
      }, 0);
    }
  }, [isLoading, isAuthenticated]);

  const [authError, setAuthError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    try {
      setAuthError(null);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const mockUser = { email };
      const mockToken = 'mock_token_' + Date.now();
      await storage.setUserData(mockUser);
      await storage.setAuthToken(mockToken);
      setUser(mockUser);
      setIsAuthenticated(true);
      router.replace('/(app)/home');
    } catch (error) {
      setAuthError('Login failed. Please try again.');
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock successful signup
      const mockUser = { name, email };
      const mockToken = 'mock_token_' + Date.now();

      // Save to storage
      await storage.setUserData(mockUser);
      await storage.setAuthToken(mockToken);

      setUser(mockUser);
      setIsAuthenticated(true);
      router.replace('/(app)/home');
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await storage.clearAuth();
      setUser(null);
      setIsAuthenticated(false);
      router.replace('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (isLoading) {
    return null; // Or a loading spinner
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}