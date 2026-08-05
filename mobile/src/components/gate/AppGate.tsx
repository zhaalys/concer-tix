import { usePathname, useRouter } from 'expo-router';
import { useEffect, useState, type ReactNode } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { SplashOverlay } from '@/components/gate/SplashOverlay';
import { TermsOverlay } from '@/components/gate/TermsOverlay';
import { useAuth } from '@/lib/auth-context';

const AUTH_ROUTES = ['/login', '/register', '/auth/callback'];

export function AppGate({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [splashDone, setSplashDone] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const onAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));
  const showTerms = splashDone && !authLoading && !user && !termsAccepted && !onAuthRoute;
  const shouldRedirect = splashDone && !authLoading && !user && termsAccepted && !onAuthRoute;
  const renderApp = splashDone && !showTerms && !shouldRedirect && !(authLoading && !user && !onAuthRoute);

  useEffect(() => {
    if (shouldRedirect) {
      router.replace('/login' as never);
    }
  }, [shouldRedirect, router]);

  return (
    <>
      {renderApp ? children : null}
      {!splashDone ? (
        <SplashOverlay onDone={() => setSplashDone(true)} />
      ) : showTerms ? (
        <TermsOverlay onAccept={() => setTermsAccepted(true)} />
      ) : !renderApp ? (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator color="#0E9375" size="large" />
        </View>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 1000,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
