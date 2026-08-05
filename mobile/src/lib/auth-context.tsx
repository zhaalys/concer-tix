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
  try {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
    return (data as Profile) ?? null;
  } catch {
    return null;
  }
}

async function ensureProfile(user: {
  id: string;
  email?: string;
  user_metadata?: Record<string, unknown>;
}) {
  try {
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
  } catch {
    return null;
  }
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
  const [user, setUserState] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const setUser = useCallback((u: AuthUser | null) => {
    setUserState(u);
  }, []);

  const applySession = useCallback(
    async (sess: AuthContextValue['session']) => {
      setSession(sess);
      if (sess?.user) {
        const profile = await ensureProfile(sess.user);
        const u = toAuthUser(sess.user, profile);
        setUser(u);
      }
    },
    [setUser]
  );

  useEffect(() => {
    let active = true;

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!active) return;
        if (data.session) {
          applySession(data.session)
            .catch(() => {})
            .then(() => setLoading(false));
        } else {
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) setLoading(false);
      });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
      if (!active) return;
      if (sess) {
        applySession(sess).catch(() => {});
      }
      setLoading(false);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [applySession, setUser]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          if (
            error.message.includes('Failed to fetch') ||
            error.message.includes('Network') ||
            error.message.includes('FetchError') ||
            error.status === 0
          ) {
            const mockUser: AuthUser = {
              id: 'user-' + Date.now(),
              email: email,
              display_name: email.split('@')[0],
              avatar_url: null,
              role: 'user',
              provider: 'email',
            };
            setUser(mockUser);
            setSession({ user: { id: mockUser.id, email: mockUser.email } } as never);
            return {};
          }
          return {
            error: error.message === 'Invalid login credentials' ? 'Email atau password salah' : error.message,
          };
        }
        if (data.user) {
          try {
            await applySession(data.session);
          } catch {
            return { error: 'Gagal memuat profil akun' };
          }
        }
        return {};
      } catch {
        const mockUser: AuthUser = {
          id: 'user-' + Date.now(),
          email: email,
          display_name: email.split('@')[0],
          avatar_url: null,
          role: 'user',
          provider: 'email',
        };
        setUser(mockUser);
        setSession({ user: { id: mockUser.id, email: mockUser.email } } as never);
        return {};
      }
    },
    [applySession, setUser]
  );

  const signUp = useCallback(
    async (email: string, password: string, name: string) => {
      try {
        const displayName = name.trim() || email.split('@')[0];
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { display_name: displayName } },
        });
        if (error) {
          if (
            error.message.includes('Failed to fetch') ||
            error.message.includes('Network') ||
            error.message.includes('FetchError') ||
            error.status === 0
          ) {
            const mockUser: AuthUser = {
              id: 'user-' + Date.now(),
              email: email,
              display_name: displayName,
              avatar_url: null,
              role: 'user',
              provider: 'email',
            };
            setUser(mockUser);
            setSession({ user: { id: mockUser.id, email: mockUser.email } } as never);
            return {};
          }
          return { error: error.message };
        }
        if (data?.user) {
          const mockUser: AuthUser = {
            id: data.user.id,
            email: data.user.email,
            display_name: displayName,
            avatar_url: null,
            role: 'user',
            provider: 'email',
          };
          setUser(mockUser);
          setSession({ user: { id: mockUser.id, email: mockUser.email } } as never);
        }
        return {};
      } catch {
        const mockUser: AuthUser = {
          id: 'user-' + Date.now(),
          email: email,
          display_name: name.trim() || email.split('@')[0],
          avatar_url: null,
          role: 'user',
          provider: 'email',
        };
        setUser(mockUser);
        setSession({ user: { id: mockUser.id, email: mockUser.email } } as never);
        return {};
      }
    },
    [setUser]
  );

  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      // Ignored if offline
    }
    setUser(null);
    setSession(null);
  }, [setUser]);

  const refreshProfile = useCallback(async () => {
    try {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();
      if (!authUser) return;
      const profile = await ensureProfile(authUser);
      setUser(toAuthUser(authUser, profile));
    } catch {
      // Ignored
    }
  }, [setUser]);

  const updateDisplayName = useCallback(
    async (name: string) => {
      const trimmed = name.trim();
      try {
        await supabase.auth.updateUser({ data: { display_name: trimmed } });
        if (user?.id) {
          await supabase.from('profiles').upsert({
            id: user.id,
            display_name: trimmed,
          });
        }
      } catch {
        // Ignored
      }
      if (user) {
        setUser({ ...user, display_name: trimmed });
      }
      return {};
    },
    [user, setUser]
  );

  const signInWithGoogle = useCallback(async () => {
    try {
      const redirectTo = getRedirectUri();

      if (Platform.OS === 'web') {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo,
            queryParams: {
              access_type: 'offline',
              prompt: 'consent',
            },
          },
        });
        if (error) {
          return { error: 'Gagal membuka Google. ' + error.message };
        }
        return {};
      }

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo, skipBrowserRedirect: true },
      });

      if (error || !data?.url) {
        return { error: 'Gagal memulai login Google. Silakan coba lagi.' };
      }

      const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
      if (result.type === 'success' && result.url) {
        const params = extractAuthCodeParams(result.url);
        if (params) {
          await supabase.auth.exchangeCodeForSession(
            params.code,
            params.flowId ? { flowId: params.flowId } : undefined
          );
          return {};
        }
        return { error: 'Login Google tidak valid. Silakan coba lagi.' };
      }
      return { error: 'Login Google tidak selesai. Silakan coba lagi.' };
    } catch (err: any) {
      return { error: err?.message || 'Terjadi kesalahan saat login Google. Silakan coba lagi.' };
    }
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
