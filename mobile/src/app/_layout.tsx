import { PlusJakartaSans_400Regular, PlusJakartaSans_500Medium, PlusJakartaSans_600SemiBold, PlusJakartaSans_700Bold, PlusJakartaSans_800ExtraBold, useFonts } from '@expo-google-fonts/plus-jakarta-sans';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { AppGate } from '@/components/gate/AppGate';
import { AuthProvider } from '@/lib/auth-context';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    PlusJakartaSans: PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium: PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold: PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold: PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold: PlusJakartaSans_800ExtraBold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AuthProvider>
      <View style={styles.backdrop}>
        <View style={styles.app}>
          <StatusBar style="dark" />
          <AppGate>
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: '#FFFFFF' },
              }}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="profile" />
              <Stack.Screen name="event/[id]" />
              <Stack.Screen name="event/[id]/checkout" />
              <Stack.Screen name="event/[id]/checkout/success" />
              <Stack.Screen name="my-tickets/[code]" />
              <Stack.Screen name="my-tickets/[code]/qr" />
              <Stack.Screen name="my-tickets/wristband/[code]" />
              <Stack.Screen name="wristband/order" />
              <Stack.Screen name="login" />
              <Stack.Screen name="register" />
              <Stack.Screen name="auth/callback" />
              <Stack.Screen name="about" />
              <Stack.Screen name="our-journey" />
              <Stack.Screen name="pricing" />
              <Stack.Screen name="faq" />
            </Stack>
          </AppGate>
        </View>
      </View>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Platform.OS === 'web' ? '#334155' : '#FFFFFF',
  },
  app: {
    flex: 1,
    width: '100%',
    maxWidth: 480,
    backgroundColor: '#FFFFFF',
  },
});
