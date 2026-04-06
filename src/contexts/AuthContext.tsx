'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import axios from 'axios';
import { api } from '@/lib/axios';
import { tokenStore, decodeToken } from '@/lib/token';
import type { JwtClaims, LoginRequest } from '@/types';

// ─── Shape ───────────────────────────────────────────────────────────────────
interface AuthContextValue {
  user: JwtClaims | null;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<JwtClaims | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount: try to restore the session via the refresh token cookie.
  useEffect(() => {
    const restore = async () => {
      try {
        const BASE_URL =
          process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';
        const { data } = await axios.post<{ data: { accessToken: string } }>(
          `${BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true },
        );
        const token = data.data.accessToken;
        tokenStore.set(token);
        setUser(decodeToken(token));
      } catch {
        // No valid refresh token — user must log in.
        tokenStore.clear();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    restore();
  }, []);

  const login = useCallback(async (credentials: LoginRequest) => {
    const BASE_URL =
      process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';
    const response = await axios.post<{ data: { accessToken: string } }>(
      `${BASE_URL}/auth/login`,
      credentials,
      { withCredentials: true },
    );
    const token = response.data.data.accessToken;
    tokenStore.set(token);
    setUser(decodeToken(token));
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Best-effort — clear local state regardless.
    } finally {
      tokenStore.clear();
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────────────────────────
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
