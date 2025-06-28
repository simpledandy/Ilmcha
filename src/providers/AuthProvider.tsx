// src/providers/AuthProvider.tsx
import React, { createContext, useState, useEffect } from "react";
import { replace } from "../utils/navigation";
import { storage } from "../utils/storage";

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
  signup: (
    name: string,
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export function AuthProvider({ children, navigationReady }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  const checkAuth = async () => {
    try {
      const userData = await storage.getUserData();
      const token = await storage.getAuthToken();

      if (userData && token) {
        setUser(userData);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (navigationReady) {
      void checkAuth();
    }
  }, [navigationReady]);

  useEffect(() => {
    if (navigationReady && isAuthenticated && user) {
      if (user.needsOnboarding) {
        replace("/(app)/onboarding");
      } else {
        replace("/(app)");
      }
    }
  }, [isAuthenticated, user, navigationReady]);

  const login = async (email: string, _password: string): Promise<void> => {
    try {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const mockUser = { email, needsOnboarding: false };
      const mockToken = "mock_token_" + Date.now();
      await storage.setUserData(mockUser);
      await storage.setAuthToken(mockToken);
      setUser(mockUser);
      setIsAuthenticated(true);
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "An unknown error occurred during login.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (
    name: string,
    email: string,
    _password: string,
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const mockUser = { name, email, needsOnboarding: true };
      const mockToken = "mock_token_" + Date.now();
      await storage.setUserData(mockUser);
      await storage.setAuthToken(mockToken);
      setUser(mockUser);
      setIsAuthenticated(true);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "An unknown error occurred",
      };
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
        replace("/(app)");
      }
    } catch (error) {
      console.error("Failed to complete onboarding:", error);
    }
  };

  const logout = async () => {
    try {
      await storage.clearAuth();
      setUser(null);
      setIsAuthenticated(false);
      replace("/(auth)");
    } catch (error) {
      console.error("Logout error:", error);
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
