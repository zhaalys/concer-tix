import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppButton } from '@/components/AppButton';
import { AppImage } from '@/components/AppImage';
import { ScreenHeader } from '@/components/ScreenHeader';
import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/lib/auth-context';

const MENU_ITEMS = [
  { label: 'Tiket Saya', icon: 'confirmation-number', href: '/tickets' },
  { label: 'Tiket Gelang (Wristband)', icon: 'style', href: '/wristband' },
  { label: 'Tentang Kami (About Us)', icon: 'info-outline', href: '/about' },
  { label: 'Perjalanan Kami (Our Journey)', icon: 'timeline', href: '/our-journey' },
  { label: 'Harga (Pricing)', icon: 'sell', href: '/pricing' },
  { label: 'Pertanyaan Umum (FAQ)', icon: 'help-outline', href: '/faq' },
] as const;

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, loading, signOut, updateDisplayName } = useAuth();

  const [name, setName] = useState(user?.display_name ?? '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user?.display_name) {
      setName(user.display_name);
    }
  }, [user?.display_name]);

  if (!loading && !user) {
    return (
      <View style={styles.root}>
        <ScreenHeader title="Profil Saya" />
        <ScrollView
          style={styles.container}
          contentContainerStyle={[styles.centerContent, { paddingBottom: 60 + insets.bottom }]}
          showsVerticalScrollIndicator={false}>
          <View style={styles.avatarCircle}>
            <MaterialIcons name="person" size={40} color="#FFFFFF" />
          </View>
          <ThemedText style={styles.guestTitle}>Selamat Datang di Concer TIX</ThemedText>
          <ThemedText style={styles.guestText}>Masuk untuk melihat tiket konser dan profil Anda.</ThemedText>
          <AppButton label="Log In" onPress={() => router.push('/login')} style={styles.loginBtn} />
          <AppButton
            label="Sign Up"
            variant="outline"
            onPress={() => router.push('/register')}
            style={styles.signupBtn}
          />
        </ScrollView>
      </View>
    );
  }

  const provider = user?.provider === 'google' ? 'Google' : 'Email';
  const initial = (user?.display_name || user?.email || 'U').charAt(0).toUpperCase();

  const handleSave = async () => {
    if (!name.trim() || name.trim() === user?.display_name) return;
    setSaving(true);
    const res = await updateDisplayName(name.trim());
    setSaving(false);
    if (!res.error) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const handleLogout = async () => {
    await signOut();
    router.replace('/' as never);
  };

  return (
    <View style={styles.root}>
      <ScreenHeader title="Profil Saya" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.content, { paddingBottom: 60 + insets.bottom }]}
        showsVerticalScrollIndicator={false}>
        {/* Avatar & Info */}
        <View style={styles.identity}>
          {user?.avatar_url ? (
            <AppImage src={user.avatar_url} style={styles.avatar} radius={36} />
          ) : (
            <View style={styles.avatarFallback}>
              <ThemedText style={styles.avatarLetter}>{initial}</ThemedText>
            </View>
          )}
          <View style={styles.identityText}>
            <ThemedText style={styles.name}>{user?.display_name || 'User'}</ThemedText>
            <ThemedText style={styles.email}>{user?.email}</ThemedText>
            <ThemedText style={styles.provider}>{provider} sign-in</ThemedText>
          </View>
        </View>

        {/* Edit Display Name */}
        <View style={styles.card}>
          <ThemedText style={styles.cardLabel}>DISPLAY NAME</ThemedText>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={(val) => {
                setName(val);
                setSaved(false);
              }}
              placeholder="Your name"
              placeholderTextColor="#ADB5BD"
            />
            <Pressable
              disabled={saving || !name.trim() || name.trim() === user?.display_name}
              onPress={handleSave}
              style={({ pressed }) => [
                styles.saveBtn,
                name.trim() && name.trim() !== user?.display_name ? styles.saveBtnActive : styles.saveBtnDisabled,
                pressed && styles.pressed,
              ]}>
              <ThemedText
                style={[
                  styles.saveBtnText,
                  name.trim() && name.trim() !== user?.display_name ? styles.saveBtnTextActive : styles.saveBtnTextDisabled,
                ]}>
                {saving ? 'Saving...' : saved ? 'Saved' : 'Save'}
              </ThemedText>
            </Pressable>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Menu Items */}
        <View style={styles.menu}>
          {MENU_ITEMS.map((item) => (
            <Pressable
              key={item.label}
              onPress={() => router.push(item.href as never)}
              style={({ pressed }) => [styles.menuItem, pressed && styles.pressed]}>
              <MaterialIcons name={item.icon} size={20} color="#0E9375" />
              <ThemedText style={styles.menuLabel}>{item.label}</ThemedText>
              <MaterialIcons name="chevron-right" size={20} color="#ADB5BD" />
            </Pressable>
          ))}
        </View>

        {/* Log Out */}
        <Pressable onPress={handleLogout} style={({ pressed }) => [styles.logoutBtn, pressed && styles.logoutPressed]}>
          <MaterialIcons name="logout" size={18} color="#EF4444" />
          <ThemedText style={styles.logoutText}>Log out</ThemedText>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    gap: 20,
  },
  centerContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 12,
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#1ABC9C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  guestTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1D2E',
  },
  guestText: {
    fontSize: 14,
    color: '#868E96',
    textAlign: 'center',
  },
  loginBtn: {
    width: '100%',
    marginTop: 12,
  },
  signupBtn: {
    width: '100%',
  },
  identity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 8,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  avatarFallback: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#1ABC9C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  identityText: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1D2E',
    letterSpacing: -0.2,
  },
  email: {
    fontSize: 13,
    color: '#868E96',
  },
  provider: {
    fontSize: 12,
    color: '#ADB5BD',
    marginTop: 2,
  },
  card: {
    gap: 8,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#868E96',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 42,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#1A1D2E',
    backgroundColor: '#FFFFFF',
  },
  saveBtn: {
    height: 42,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnActive: {
    backgroundColor: '#1ABC9C',
  },
  saveBtnDisabled: {
    backgroundColor: '#F1F3F5',
  },
  saveBtnText: {
    fontSize: 13,
    fontWeight: '600',
  },
  saveBtnTextActive: {
    color: '#FFFFFF',
  },
  saveBtnTextDisabled: {
    color: '#ADB5BD',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F3F5',
  },
  menu: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F5',
  },
  menuLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1D2E',
  },
  logoutBtn: {
    height: 44,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F1F3F5',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  logoutText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#EF4444',
  },
  logoutPressed: {
    backgroundColor: '#FEF2F2',
  },
  pressed: {
    opacity: 0.8,
  },
});
