import { createContext, useState, useEffect, useCallback } from 'react';
import * as authApi from '../api/auth';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const { data } = await authApi.getMe();
      setUser(data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
    const handleLogout = () => setUser(null);
    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, [checkAuth]);

  const login = async (credentials) => {
    const { data } = await authApi.login(credentials);
    // server now returns { user, token } — persist token as fallback
    if (data?.token) {
      try {
        localStorage.setItem('token', data.token);
      } catch (e) {}
    }
    setUser(data.user || data);
    return data;
  };

  const register = async (userData) => {
    const { data } = await authApi.register(userData);
    if (data?.token) {
      try {
        localStorage.setItem('token', data.token);
      } catch (e) {}
    }
    setUser(data.user || data);
    return data;
  };

  const logout = async () => {
    await authApi.logout();
    try { localStorage.removeItem('token'); } catch (e) {}
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}
