import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { logout as logoutRequest, validateSession } from '../api/auth';
import { setUnauthorizedHandler } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('token'));
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  const clearSession = useCallback(() => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  }, []);

  const logout = useCallback(async () => {
    try {
      if (localStorage.getItem('token')) {
        await logoutRequest();
      }
    } finally {
      clearSession();
    }
  }, [clearSession]);

  const login = useCallback((token) => {
    localStorage.setItem('token', token);
    setIsLoggedIn(true);
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(clearSession);
  }, [clearSession]);

  useEffect(() => {
    const bootstrap = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsBootstrapping(false);
        return;
      }

      try {
        await validateSession();
        setIsLoggedIn(true);
      } catch {
        clearSession();
      } finally {
        setIsBootstrapping(false);
      }
    };

    bootstrap();
  }, [clearSession]);

  const value = useMemo(
    () => ({ isLoggedIn, isBootstrapping, login, logout }),
    [isLoggedIn, isBootstrapping, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
