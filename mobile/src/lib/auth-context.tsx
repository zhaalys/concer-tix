import { makeRedirectUri } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import { Platform } from 'react-native';

import type { Profile } from './types';
import { extractAuthCodeParams } from './auth-url';
import { supabase } from './supabase';

export interface AuthUser {
  id: string;
  email: string | undefined;
  display_name: string | null;
  avatar_url: string | null;
  role: string | null;
  provider: string | null;
}

interface AuthContextValue {
  session: Awaited<ReturnType<typeof supabase.auth.getSession>>['data']['session'];
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateDisplayName: (name: string) => Promise<{ error?: string }>;
  signInWithGoogle: () => Promise<{ error?: string }>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function getRedirectUri(): string {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    return `${window.location.origin}/auth/callback`;
  }
  return makeRedirectUri({ scheme: 'concertix', path: 'auth/callback' });
}

async function loadProfile(userId: string): Promise<Profile | null> {
  const { data } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
  return (data as Profile) ?? null;
}

async function ensureProfile(user: {
  id: string;
  email?: string;
  user_metadata?: Record<string, unknown>;
}) {
  const existing = await loadProfile(user.id);
  if (existing) return existing;
  const displayName = (user.user_metadata?.display_name as string) || user.email?.split('@')[0] || null;
  const { data, error } = await supabase
    .from('profiles')
    .upsert({ id: user.id, display_name: displayName }, { onConflict: 'id' })
    .select()
    .single();
  if (error) return null;
  return (data as Profile) ?? null;
}

function toAuthUser(
  user: Awaited<ReturnType<typeof supabase.auth.getUser>>['data']['user'],
  profile: Profile | null
): AuthUser {
  if (!user) throw new Error('No auth user');
  return {
    id: user.id,
    email: user.email,
    display_name: profile?.display_name ?? (user.user_metadata?.display_name as string) ?? null,
    avatar_url: profile?.avatar_url ?? (user.user_metadata?.avatar_url as string) ?? null,
    role: profile?.role ?? null,
    provider: user.app_metadata?.provider ?? null,
  };
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<AuthContextValue['session']>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const applySession = useCallback(async (sess: AuthContextValue['session']) => {
    setSession(sess);
    if (sess?.user) {
      const profile = await ensureProfile(sess.user);
      setUser(toAuthUser(sess.user, profile));
    } else {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      applySession(data.session)
        .catch(() => {})
        .then(() => setLoading(false));
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
      if (!active) return;
      applySession(sess).catch(() => {});
      setLoading(false);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [applySession]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { error: error.message === 'Invalid login credentials' ? 'Email atau password salah' : error.message };
      if (data.user) {
        try {
          await applySession(data.session);
        } catch {
          return { error: 'Gagal memuat profil akun' };
        }
      }
      return {};
    },
    [applySession]
  );

  const signUp = useCallback(
    async (email: string, password: string, name: string) => {
      const displayName = name.trim() || email.split('@')[0];
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { display_name: displayName } },
      });
      if (error) return { error: error.message };
      return {};
    },
    []
  );

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    if (!authUser) return;
    const profile = await ensureProfile(authUser);
    setUser(toAuthUser(authUser, profile));
  }, []);

  const updateDisplayName = useCallback(
    async (name: string) => {
      const { error } = await supabase.auth.updateUser({ data: { display_name: name } });
      if (error) return { error: error.message };
      await supabase.from('profiles').upsert({
        id: user?.id ?? '',
        display_name: name,
      });
      await refreshProfile();
      return {};
    },
    [user, refreshProfile]
  );

  const signInWithGoogle = useCallback(async () => {
    const redirectTo = getRedirectUri();
    if (Platform.OS === 'web') {
      await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo } });
      return {};
    }
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo, skipBrowserRedirect: true },
    });
    if (error) return { error: error.message };
    if (data?.url) {
      const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
      if (result.type === 'success' && result.url) {
        const params = extractAuthCodeParams(result.url);
        if (params) {
          const { error: exErr } = await supabase.auth.exchangeCodeForSession(
            params.code,
            params.flowId ? { flowId: params.flowId } : undefined
          );
          if (exErr) return { error: exErr.message };
        } else {
          return {
            error:
              'Login Google tidak dikembalikan ke aplikasi. Pastikan URL redirect `exp://**` sudah ditambahkan di Supabase (Auth → URL Configuration).',
          };
        }
      }
    }
    return {};
  }, []);

  const value = useMemo(
    () => ({ session, user, loading, signIn, signUp, signOut, refreshProfile, updateDisplayName, signInWithGoogle }),
    [session, user, loading, signIn, signUp, signOut, refreshProfile, updateDisplayName, signInWithGoogle]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
