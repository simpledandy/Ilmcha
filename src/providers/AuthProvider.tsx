// src/providers/AuthProvider.tsx
import React, { createContext, useState, useEffect } from 'react';
import { router } from 'expo-router';
import { storage } from '../utils/storage';
import { signIn, signUp, supabase } from '../utils/supabaseClient';
import { authUtils } from '../utils/authUtils';
import { AuthErrorProvider, useAuthError } from './AuthErrorContext';

interface AuthProviderProps {
  children: React.ReactNode;
  navigationReady: boolean;
}

interface User {
  id: string;
  name?: string;
  email: string;
  needsOnboarding?: boolean;
  emailConfirmed?: boolean;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
  createParentRecord: () => Promise<{ success: boolean; error?: string }>;
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
  const { setError, clearError } = useAuthError();

  const checkAuth = async () => {
    setIsAuthenticated(false);
    setUser(null);
    setIsLoading(true);
    try {
      const storedUser = await storage.getUserData();
      if (storedUser && storedUser.email) {
        setUser(storedUser as User);
        setIsAuthenticated(true);
        setIsLoading(false);
        return;
      }
      const isSessionValid = await authUtils.validateAndRefreshSession();
      if (isSessionValid) {
        const userData = await authUtils.getCurrentUser();
        if (userData && userData.email) {
          setUser(userData as User);
          setIsAuthenticated(true);
          await storage.setUserData(userData as User);
        }
      }
    } catch {
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!navigationReady) return;
    let subscription: any = null;
    try {
      const { data } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          try {
            const user = session?.user;
            const accessToken = session?.access_token;
            if (event === 'SIGNED_IN' && user?.email) {
              const userData = {
                id: user.id,
                email: user.email,
                needsOnboarding: false,
                emailConfirmed: (user as any).email_confirmed_at !== null
              };
              setUser(userData);
              setIsAuthenticated(true);
              await storage.setUserData(userData);
              if (accessToken) {
                await storage.setAuthToken(accessToken);
              }
            } else if (event === 'SIGNED_OUT') {
              await storage.clearAuth();
              setUser(null);
              setIsAuthenticated(false);
            } else if (event === 'TOKEN_REFRESHED' && user?.email) {
              const userData = {
                id: user.id,
                email: user.email,
                needsOnboarding: false,
                emailConfirmed: (user as any).email_confirmed_at !== null
              };
              setUser(userData);
              setIsAuthenticated(true);
              await storage.setUserData(userData);
              if (accessToken) {
                await storage.setAuthToken(accessToken);
              }
            } else if (event === 'USER_UPDATED' && user?.email) {
              const userData = {
                id: user.id,
                email: user.email,
                name: (user as any)?.name,
                needsOnboarding: (user as any)?.needsOnboarding ?? false,
                emailConfirmed: (user as any).email_confirmed_at !== null
              };
              setUser(userData);
              await storage.setUserData(userData);
            }
          } catch {}
        }
      );
      subscription = data.subscription;
    } catch {}
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [navigationReady]);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    clearError();
    try {
      const result = await signIn(email, password);
      const supaUser = result.user;
      const error = result.error;
      if (error || !supaUser || !supaUser.email) {
        setIsAuthenticated(false);
        setUser(null);
        setError('auth.login_error');
        throw { message: 'auth.login_error', code: 'LOGIN_ERROR' } as AuthError;
      }
      const userData = {
        id: supaUser.id,
        email: supaUser.email || '',
        needsOnboarding: false,
        emailConfirmed: (supaUser as any).email_confirmed_at !== null
      };
      setUser(userData);
      setIsAuthenticated(true);
      await storage.setUserData(userData);
      const session = await supabase.auth.getSession();
      if (session.data.session?.access_token) {
        await storage.setAuthToken(session.data.session.access_token);
      }
    } catch {
      setIsAuthenticated(false);
      setUser(null);
      setError('auth.login_error');
      throw { message: 'auth.login_error', code: 'LOGIN_ERROR' } as AuthError;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    clearError();
    try {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email) || password.length < 6 || name.trim().length < 2) {
        setError('auth.signup_error');
        return { success: false, error: 'auth.signup_error' };
      }
      const result = await signUp(email, password);
      const supaUser = result.user;
      const error = result.error;
      if (error || !supaUser || !supaUser.id || !supaUser.email) {
        setError('auth.signup_error');
        return { success: false, error: 'auth.signup_error' };
      }
      const userData = {
        id: supaUser.id,
        name,
        email: supaUser.email,
        needsOnboarding: true,
        emailConfirmed: false
      };
      setUser(userData);
      setIsAuthenticated(true);
      await storage.setUserData(userData);
      const session = await supabase.auth.getSession();
      if (session.data.session?.access_token) {
        await storage.setAuthToken(session.data.session.access_token);
      }
      return { success: true };
    } catch {
      setError('auth.unknown_error');
      return { success: false, error: 'auth.unknown_error' };
    } finally {
      setIsLoading(false);
    }
  };

  const createParentRecord = async (): Promise<{ success: boolean; error?: string }> => {
    if (!user?.id || !user?.name) {
      setError('auth.unknown_error');
      return { success: false, error: 'auth.unknown_error' };
    }
    try {
      const { data: existingParent } = await supabase
        .from('parents')
        .select('id')
        .eq('id', user.id)
        .single();
      if (existingParent) {
        return { success: true };
      }
      const { error: parentError } = await supabase
        .from('parents')
        .insert([{ id: user.id, name: user.name }]);
      if (parentError) {
        setError('auth.unknown_error');
        return { success: false, error: 'auth.unknown_error' };
      }
      return { success: true };
    } catch {
      setError('auth.unknown_error');
      return { success: false, error: 'auth.unknown_error' };
    }
  };

  const completeOnboarding = async () => {
    if (user) {
      await authUtils.completeOnboarding();
      setUser({ ...user, needsOnboarding: false });
      router.replace('/(app)');
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } finally {
      await storage.clearAuth();
      setUser(null);
      setIsAuthenticated(false);
      router.replace('/(auth)');
    }
  };

  return (
    <AuthErrorProvider>
      <AuthContext.Provider
        value={{
          isAuthenticated,
          user,
          isLoading,
          login,
          signup,
          logout,
          completeOnboarding,
          createParentRecord,
        }}
      >
        {children}
      </AuthContext.Provider>
    </AuthErrorProvider>
  );
}