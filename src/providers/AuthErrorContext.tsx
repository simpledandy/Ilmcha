import React, { createContext, useContext, useState } from 'react';

interface AuthErrorContextType {
  error: string | null;
  setError: (msg: string) => void;
  clearError: () => void;
}

const AuthErrorContext = createContext<AuthErrorContextType | undefined>(undefined);

export const AuthErrorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [error, setErrorState] = useState<string | null>(null);
  return (
    <AuthErrorContext.Provider value={{
      error,
      setError: setErrorState,
      clearError: () => setErrorState(null)
    }}>
      {children}
    </AuthErrorContext.Provider>
  );
};

export function useAuthError() {
  const ctx = useContext(AuthErrorContext);
  if (!ctx) throw new Error('useAuthError must be used within an AuthErrorProvider');
  return ctx;
} 