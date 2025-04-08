/*import React, { createContext, useContext, useState } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = async (email: string, password: string) => {
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate successful login
      setUser({ email });
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate successful signup
      setUser({ name, email });
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setIsLoading(true);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
*/
import { useContext } from 'react';
import { AuthContext } from '@providers/AuthProvider';

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}