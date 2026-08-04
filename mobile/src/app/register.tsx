import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppButton } from '@/components/AppButton';
import { AuthLink, AuthScreen } from '@/components/auth/AuthScreen';
import { FormInput } from '@/components/FormInput';
import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/lib/auth-context';

export default function RegisterScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ next?: string }>();
  const { signUp, signInWithGoogle } = useAuth();

  const [step, setStep] = useState<'register' | 'register_password'>('register');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  const next = params.next && params.next.startsWith('/') && !params.next.startsWith('//') ? params.next : null;

  const handleSubmit = async () => {
    if (step === 'register') {
      if (!name.trim() || !email.trim()) return;
      setStep('register_password');
      return;
    }
    setLoading(true);
    setError('');
    const res = await signUp(email, password, name);
    setLoading(false);
    if (res.error) {
      setError(res.error);
      return;
    }
    router.replace({ pathname: '/login', params: { check_email: 'true', ...(next ? { next } : {}) } } as never);
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    setError('');
    const res = await signInWithGoogle();
    setGoogleLoading(false);
    if (res.error) setError(res.error);
  };

  return (
    <AuthScreen
      heading="Create an account"
      subtitle="Sign up to get started with your account."
      error={error}
      googleLoading={googleLoading}
      onGoogle={handleGoogle}
      footer={
        <View style={styles.footerRow}>
          <ThemedText style={styles.footerText}>Already have an account?</ThemedText>
          <AuthLink text="Log In" onPress={() => router.push({ pathname: '/login', params: next ? { next } : {} } as never)} />
        </View>
      }>
      {step === 'register_password' ? (
        <>
          <View style={styles.changeRow}>
            <ThemedText style={styles.changeLabel}>Password</ThemedText>
            <AuthLink text="Change Email" onPress={() => setStep('register')} />
          </View>
          <FormInput
            label="Password"
            placeholder="Min. 6 characters"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <AppButton
            label={loading ? 'Creating account...' : 'Create Account'}
            loading={loading}
            disabled={password.length < 6}
            onPress={handleSubmit}
            style={styles.submit}
          />
        </>
      ) : (
        <>
          <FormInput label="Name" placeholder="Your name" value={name} onChangeText={setName} />
          <FormInput
            label="Email"
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <AppButton
            label="Continue"
            disabled={!name.trim() || !email.trim()}
            onPress={handleSubmit}
            style={styles.submit}
          />
        </>
      )}
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
  changeLabel: {
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
});
