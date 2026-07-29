import { createContext, useEffect, useState, useCallback } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On app load, ask the backend "who am I?" using the httpOnly cookie.
  // If it 401s, we just treat the user as logged out.
  useEffect(() => {
    authService
      .me()
      .then((data) => setUser(data.data ?? data.user ?? data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (credentials) => {
    const data = await authService.login(credentials);
    setUser(data.data ?? data.user ?? data);
    return data;
  }, []);

  const register = useCallback(async (payload) => {
    const data = await authService.register(payload);
    setUser(data.data ?? data.user ?? data);
    return data;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
    }
  }, []);

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}
