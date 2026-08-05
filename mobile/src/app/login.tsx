import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppButton } from '@/components/AppButton';
import { AuthLink, AuthScreen } from '@/components/auth/AuthScreen';
import { FormInput } from '@/components/FormInput';
import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/lib/auth-context';

export default function LoginScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ next?: string; check_email?: string }>();
  const { signIn, signInWithGoogle } = useAuth();

  const [step, setStep] = useState<'email' | 'password'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  const next = params.next && params.next.startsWith('/') && !params.next.startsWith('//') ? params.next : null;

  const handleSubmit = async () => {
    if (step === 'email') {
      if (!email.trim()) return;
      setStep('password');
      return;
    }
    setLoading(true);
    setError('');
    const res = await signIn(email, password);
    setLoading(false);
    if (res.error) {
      setError(res.error);
      return;
    }
    router.replace((next ?? '/') as never);
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    setError('');
    const res = await signInWithGoogle();
    setGoogleLoading(false);
    if (res.error) {
      setError(res.error);
    } else if (!res.redirecting) {
      router.replace((next ?? '/') as never);
    }
  };

  return (
    <AuthScreen
      heading="Welcome back!"
      subtitle="Please log in to continue to your account."
      error={error}
      googleLoading={googleLoading}
      onGoogle={handleGoogle}
      footer={
        <View>
          {params.check_email === 'true' && (
            <View style={styles.checkBox}>
              <ThemedText style={styles.checkText}>
                Account created successfully! You are now logged in.
              </ThemedText>
            </View>
          )}
          <View style={styles.footerRow}>
            <ThemedText style={styles.footerText}>Don&apos;t have an account?</ThemedText>
            <AuthLink
              text="Sign Up"
              onPress={() => router.push({ pathname: '/register', params: next ? { next } : {} } as never)}
            />
          </View>
        </View>
      }>
      {step === 'password' && (
        <View style={styles.changeRow}>
          <ThemedText style={styles.changeEmailLabel}>Email</ThemedText>
          <AuthLink text="Change Email" onPress={() => setStep('email')} />
        </View>
      )}
      <FormInput
        label="Email"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoFocus={step === 'password'}
      />
      {step === 'password' && (
        <FormInput
          label="Password"
          placeholder="••••••••"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      )}
      <AppButton
        label={loading ? 'Processing...' : step === 'email' ? 'Continue' : 'Log In'}
        loading={loading}
        disabled={step === 'email' && !email.trim()}
        onPress={handleSubmit}
        style={styles.submit}
      />
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  submit: {
    height: 46,
    borderRadius: 10,
  },
  changeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  changeEmailLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#374151',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: 8,
  },
  footerText: {
    fontSize: 13,
    color: '#64748B',
  },
  checkBox: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  checkText: {
    fontSize: 13,
    color: '#065F46',
  },
});
