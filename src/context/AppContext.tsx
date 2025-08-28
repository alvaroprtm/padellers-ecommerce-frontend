import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';

interface User {
  id: number;
  name: string;
  token: string;
  role: string;
  permissions: string[];
}

interface AppContextValue {
  user: User | null;
  setUser: (u: User | null) => void;
  loading: boolean;
  error: string | null;
  startLoading: () => void;
  stopLoading: () => void;
  setError: (msg: string | null) => void;
  clearError: () => void;
  logout: () => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, _setUser] = useState<User | null>(() => {
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('userName');
    const role = localStorage.getItem('role');
    const id = localStorage.getItem('id');
    const permissions = localStorage.getItem('permissions');
    
    return token && name && role && permissions && id ? {
      token,
      name,
      role,
      permissions: JSON.parse(permissions),
      id: Number(id)
    } : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setErrorState] = useState<string | null>(null);

  const setUser = useCallback((u: User | null) => {
    _setUser(u);
    if (u) {
      localStorage.setItem('token', u.token);
      localStorage.setItem('userName', u.name);
      localStorage.setItem('role', u.role);
      localStorage.setItem('permissions', JSON.stringify(u.permissions));
      localStorage.setItem('id', String(u.id));
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('userName');
      localStorage.removeItem('role');
      localStorage.removeItem('permissions');
      localStorage.removeItem('id');
    }
  }, []);

  const startLoading = useCallback(() => setLoading(true), []);
  const stopLoading = useCallback(() => setLoading(false), []);
  const setError = useCallback((msg: string | null) => setErrorState(msg), []);
  const clearError = useCallback(() => setErrorState(null), []);
  const logout = useCallback(() => setUser(null), [setUser]);

  const value: AppContextValue = {
    user,
    setUser,
    loading,
    error,
    startLoading,
    stopLoading,
    setError,
    clearError,
    logout,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used inside AppProvider');
  return ctx;
};