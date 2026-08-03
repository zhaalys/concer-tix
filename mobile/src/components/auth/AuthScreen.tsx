import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppButton } from '../AppButton';
import { FormInput } from '../FormInput';
import { ThemedText } from '../themed-text';
import { resolveImage } from '@/lib/assets';

interface AuthScreenProps {
  heading: string;
  subtitle: string;
  error?: string;
  children: React.ReactNode;
  googleLoading?: boolean;
  onGoogle: () => void;
  footer?: React.ReactNode;
}

export function AuthScreen({ heading, subtitle, error, children, googleLoading, onGoogle, footer }: AuthScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        style={styles.flex}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 32, paddingBottom: 40 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={styles.inner}>
          <View style={styles.logoRow}>
            <Image source={resolveImage('/logo/tix_logo.png')} style={styles.logo} contentFit="contain" />
            <View style={styles.idPill}>
              <View style={styles.idDot} />
              <ThemedText style={styles.idText}>ID</ThemedText>
            </View>
          </View>

          <ThemedText style={styles.heading}>{heading}</ThemedText>
          <ThemedText style={styles.subtitle}>{subtitle}</ThemedText>

          {error ? (
            <View style={styles.errorBox}>
              <ThemedText style={styles.errorText}>{error}</ThemedText>
            </View>
          ) : null}

          {children}

          <Divider />

          <AppButton
            label={googleLoading ? 'Processing...' : 'Google'}
            variant="outline"
            loading={googleLoading}
            onPress={onGoogle}
            style={styles.googleBtn}
          />

          {footer}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Divider() {
  return (
    <View style={styles.dividerRow}>
      <View style={styles.dividerLine} />
      <ThemedText style={styles.dividerText}>or</ThemedText>
      <View style={styles.dividerLine} />
    </View>
  );
}

export function AuthLink({ text, onPress, style }: { text: string; onPress: () => void; style?: object }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.footerLink, style, pressed && styles.pressed]}>
      <ThemedText style={styles.footerLinkText}>{text}</ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  inner: {
    width: '100%',
    maxWidth: 380,
    alignSelf: 'center',
    gap: 6,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  logo: {
    width: 130,
    height: 50,
  },
  idPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 100,
  },
  idDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#EF4444',
  },
  idText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  heading: {
    fontSize: 24,
    fontWeight: '600',
    color: '#0F172A',
    letterSpacing: -0.02,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 20,
  },
  errorBox: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 8,
    padding: 10,
    marginBottom: 14,
  },
  errorText: {
    fontSize: 13,
    color: '#DC2626',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 18,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    fontSize: 12,
    color: '#94A3B8',
  },
  googleBtn: {
    height: 42,
    borderRadius: 8,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  footerLink: {
    alignItems: 'center',
    marginTop: 18,
  },
  footerLinkText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F766E',
  },
  pressed: {
    opacity: 0.7,
  },
});
