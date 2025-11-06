<<<<<<< HEAD
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { loadAuth, saveAuth, clearAuth } from '../storage/authStorage';

type AuthUser = { id: number; first_name: string; last_name: string; email: string };
=======
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { loadAuth, saveAuth, clearAuth } from '../storage/authStorage';
import { setAuthToken } from '../services/api';

type AuthUser = {
  id: number;
  first_name: string;
  last_name: string;
  profile_picture?: string | null;
  email: string;
};
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
type AuthState = { token: string; user: AuthUser };

type AuthCtx = {
  bootstrapped: boolean;
  auth: AuthState | null;
  signIn: (s: AuthState) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (u: Partial<AuthUser>) => Promise<void>;
};

const Ctx = createContext<AuthCtx | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<AuthState | null>(null);
  const [bootstrapped, setBootstrapped] = useState(false);

  useEffect(() => {
    (async () => {
      const restored = await loadAuth();
<<<<<<< HEAD
      if (restored) setAuth(restored);
=======
      if (restored) {
        setAuth(restored);
        await setAuthToken(restored.token);
      } else {
        await setAuthToken(null);
      }
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)
      setBootstrapped(true);
    })();
  }, []);

<<<<<<< HEAD
  const value = useMemo<AuthCtx>(() => ({
    bootstrapped,
    auth,
    signIn: async (s) => { await saveAuth(s); setAuth(s); },
    signOut: async () => { await clearAuth(); setAuth(null); },
    updateUser: async (patch) => {
      if (!auth) return;
      const next = { ...auth, user: { ...auth.user, ...patch } };
      await saveAuth(next);
      setAuth(next);
    },
  }), [auth, bootstrapped]);
=======
  const value = useMemo<AuthCtx>(
    () => ({
      bootstrapped,
      auth,
      signIn: async s => {
        await saveAuth(s);
        setAuth(s);
        await setAuthToken(s.token);
      },
      signOut: async () => {
        await clearAuth();
        setAuth(null);
        await setAuthToken(null);
      },
      updateUser: async patch => {
        if (!auth) return;
        const next = { ...auth, user: { ...auth.user, ...patch } };
        await saveAuth(next);
        setAuth(next);
      },
    }),
    [auth, bootstrapped],
  );
>>>>>>> a0722e0 (feat: Implement API service with authentication and data fetching)

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider/>');
  return ctx;
}
