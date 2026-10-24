import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api, clearToken, getToken, setToken } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(() => Boolean(getToken()));

  useEffect(() => {
    if (!getToken()) return undefined;
    let cancelled = false;
    api
      .get('/auth/me')
      .then((res) => {
        if (!cancelled) setAdmin(res.admin);
      })
      .catch(() => {
        clearToken();
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setAdmin(null);
  }, []);

  useEffect(() => {
    window.addEventListener('sm:unauthorized', logout);
    return () => window.removeEventListener('sm:unauthorized', logout);
  }, [logout]);

  const login = useCallback(async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    setToken(res.token);
    setAdmin(res.admin);
    return res.admin;
  }, []);

  /** payload: { name, email, password, avatar?, slug?, title?, location?, phone?, education?, job? } */
  const register = useCallback(async (payload) => {
    const res = await api.post('/auth/register', payload);
    setToken(res.token);
    setAdmin(res.admin);
    return res.admin;
  }, []);

  const value = useMemo(
    () => ({ admin, setAdmin, loading, login, register, logout, isSuperAdmin: admin?.role === 'superadmin' }),
    [admin, loading, login, register, logout]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
