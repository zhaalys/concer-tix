import * as Linking from 'expo-linking';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { extractAuthCodeParams } from '@/lib/auth-url';
import { supabase } from '@/lib/supabase';

export default function AuthCallbackScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ next?: string }>();
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    const finalize = async (url: string) => {
      if (!url) return;
      const authParams = extractAuthCodeParams(url);
      if (!authParams) return;
      const { error: exErr } = await supabase.auth.exchangeCodeForSession(
        authParams.code,
        authParams.flowId ? { flowId: authParams.flowId } : undefined
      );
      if (!active) return;
      if (exErr) {
        setError(exErr.message);
        return;
      }
      const next = params.next && params.next.startsWith('/') ? params.next : '/';
      router.replace(next as never);
    };

    if (typeof window !== 'undefined' && window.location?.href) {
      finalize(window.location.href);
    } else {
      Linking.getInitialURL().then((url) => {
        if (url) finalize(url);
      });
    }
    return () => {
      active = false;
    };
  }, [router, params.next]);

  return (
    <View style={styles.container}>
      <ActivityIndicator color="#0E9375" size="large" />
      {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}
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
  error: {
    fontSize: 13,
    color: '#DC2626',
  },
});
