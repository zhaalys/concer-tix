import * as Linking from 'expo-linking';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { extractAuthCodeParams } from '@/lib/auth-url';
import { supabase } from '@/lib/supabase';

export default function AuthCallbackScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ next?: string }>();
  const [error, setError] = useState('');
  const finalizedRef = useRef(false);

  useEffect(() => {
    let active = true;

    const next = params.next && params.next.startsWith('/') && !params.next.startsWith('//') ? params.next : null;

    const finishWithError = (message: string) => {
      if (!active || finalizedRef.current) return;
      finalizedRef.current = true;
      setError(message);
    };

    const finalize = async (url: string) => {
      if (finalizedRef.current) return;
      if (!url) {
        finishWithError('Tidak ada URL callback. Silakan coba login lagi.');
        return;
      }
      const queryIndex = url.indexOf('?');
      const searchParams = queryIndex === -1 ? null : new URLSearchParams(url.slice(queryIndex + 1));
      const errParam = searchParams?.get('error');
      if (errParam) {
        finishWithError(searchParams?.get('error_description') ?? `Login gagal (${errParam}).`);
        return;
      }
      const authParams = extractAuthCodeParams(url);
      if (authParams) {
        const { error: exErr } = await supabase.auth.exchangeCodeForSession(
          authParams.code,
          authParams.flowId ? { flowId: authParams.flowId } : undefined
        );
        if (!active || finalizedRef.current) return;
        if (exErr) {
          finishWithError(exErr.message);
          return;
        }
        finalizedRef.current = true;
        router.replace((next ?? '/') as never);
        return;
      }

      const hashIndex = url.indexOf('#');
      const fragmentParams = hashIndex === -1 ? null : new URLSearchParams(url.slice(hashIndex + 1));
      const accessToken = fragmentParams?.get('access_token');
      const refreshToken = fragmentParams?.get('refresh_token');
      if (accessToken && refreshToken) {
        const { error: setErr } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        if (!active || finalizedRef.current) return;
        if (setErr) {
          finishWithError(setErr.message);
          return;
        }
        finalizedRef.current = true;
        router.replace((next ?? '/') as never);
        return;
      }

      finishWithError('Login tidak lengkap: kode otorisasi tidak ditemukan di URL callback.');
    };

    if (typeof window !== 'undefined' && window.location?.href) {
      finalize(window.location.href);
    } else {
      Linking.getInitialURL().then((url) => {
        if (url) finalize(url);
        else finishWithError('Tidak ada URL callback. Silakan coba login lagi.');
      });
    }

    const timer = setTimeout(() => {
      if (active && !finalizedRef.current) {
        finalizedRef.current = true;
        setError('Login memakan waktu terlalu lama. Silakan coba lagi.');
      }
    }, 15000);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [router, params.next]);

  return (
    <View style={styles.container}>
      <ActivityIndicator color="#0E9375" size="large" />
      {error ? <ThemedText style={styles.error}>{error}</ThemedText> : <ThemedText style={styles.status}>Menyelesaikan login...</ThemedText>}
      {error ? (
        <ThemedText style={styles.link} onPress={() => router.replace('/login' as never)}>
          Kembali ke halaman login
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  status: {
    fontSize: 13,
    color: '#868E96',
  },
  error: {
    fontSize: 13,
    color: '#DC2626',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  link: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0E9375',
    paddingHorizontal: 32,
  },
});
