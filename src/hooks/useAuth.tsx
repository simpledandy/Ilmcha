import { useContext } from 'react';
import { AuthContext } from '../providers/AuthProvider';

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider.');
  return context;
}

// Convenience hooks for specific auth states
export function useIsAuthenticated(): boolean {
  return useAuth().isAuthenticated;
}

export function useUser() {
  return useAuth().user;
}

export function useAuthLoading(): boolean {
  return useAuth().isLoading;
}