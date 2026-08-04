import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { AppButton } from '@/components/AppButton';
import { AppImage } from '@/components/AppImage';
import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/lib/auth-context';

const MENU_ITEMS = [
  { label: 'About Us', icon: 'info-outline', href: '/about' },
  { label: 'Our Journey', icon: 'timeline', href: '/our-journey' },
  { label: 'Pricing', icon: 'sell', href: '/pricing' },
  { label: 'FAQ', icon: 'help-outline', href: '/faq' },
  { label: 'Wristband Ticket', icon: 'style', href: '/wristband' },
] as const;

export default function ProfileScreen() {
  const router = useRouter();
  const { user, loading, signOut, updateDisplayName } = useAuth();
  const [name] = useState(user?.display_name ?? '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!loading && !user) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.centerContent} showsVerticalScrollIndicator={false}>
        <View style={styles.avatarCircle}>
          <MaterialIcons name="person" size={40} color="#FFFFFF" />
        </View>
        <ThemedText style={styles.guestTitle}>Welcome to Concer TIX</ThemedText>
        <ThemedText style={styles.guestText}>Log in to view your tickets and profile.</ThemedText>
        <AppButton label="Log In" onPress={() => router.push('/login')} style={styles.loginBtn} />
        <AppButton
          label="Sign Up"
          variant="outline"
          onPress={() => router.push('/register')}
          style={styles.signupBtn}
        />
      </ScrollView>
    );
  }

  const provider = user?.provider === 'google' ? 'Google' : 'Email';
  const initial = (user?.display_name || user?.email || 'U').charAt(0).toUpperCase();

  const handleSave = async () => {
    setSaving(true);
    const res = await updateDisplayName(name);
    setSaving(false);
    if (!res.error) {
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    }
  };

  const handleLogout = async () => {
    await signOut();
    router.replace('/' as never);
  };

  return (
    <View style={styles.root}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.identity}>
          {user?.avatar_url ? (
            <AppImage src={user.avatar_url} style={styles.avatar} radius={36} />
          ) : (
            <View style={styles.avatarFallback}>
              <ThemedText style={styles.avatarLetter}>{initial}</ThemedText>
            </View>
          )}
          <ThemedText style={styles.name}>{user?.display_name || 'User'}</ThemedText>
          <ThemedText style={styles.email}>{user?.email}</ThemedText>
          <ThemedText style={styles.provider}>Signed in with {provider}</ThemedText>
        </View>

        <View style={styles.card}>
          <ThemedText style={styles.cardLabel}>Display Name</ThemedText>
          <View style={styles.inputWrap}>
            <ThemedText style={styles.inputText}>{name}</ThemedText>
          </View>
          <AppButton
            label={saving ? 'Saving...' : saved ? 'Saved' : 'Save'}
            disabled={!name.trim() || name.trim() === user?.display_name}
            onPress={handleSave}
            style={styles.saveBtn}
          />
        </View>

        <View style={styles.divider} />

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

        <AppButton label="Log out" variant="outline" onPress={handleLogout} style={styles.logout} />
      </ScrollView>

      {user ? (
        <View style={styles.topRight}>
          {user.avatar_url ? (
            <AppImage src={user.avatar_url} style={styles.topAvatar} radius={16} />
          ) : (
            <View style={styles.topAvatarFallback}>
              <ThemedText style={styles.topAvatarLetter}>{initial}</ThemedText>
            </View>
          )}
          <Pressable
            onPress={handleLogout}
            style={({ pressed }) => [styles.logoutBtn, pressed && styles.pressed]}>
            <MaterialIcons name="logout" size={20} color="#EF4444" />
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F7F9FB',
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
    gap: 16,
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
    alignItems: 'center',
    gap: 4,
  },
  avatar: {
    width: 72,
    height: 72,
    marginBottom: 6,
  },
  avatarFallback: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#1ABC9C',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  avatarLetter: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1D2E',
  },
  email: {
    fontSize: 13,
    color: '#868E96',
  },
  provider: {
    fontSize: 12,
    color: '#ADB5BD',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    padding: 16,
    gap: 10,
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#868E96',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  inputWrap: {
    height: 44,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 8,
    paddingHorizontal: 12,
    justifyContent: 'center',
    backgroundColor: '#F8F9FA',
  },
  inputText: {
    fontSize: 14,
    color: '#1A1D2E',
  },
  saveBtn: {
    height: 40,
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
  logout: {
    backgroundColor: '#FFFFFF',
    borderColor: '#EF4444',
    borderWidth: 1,
    borderRadius: 8,
    height: 46,
  },
  topRight: {
    position: 'absolute',
    top: 8,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  topAvatar: {
    width: 32,
    height: 32,
  },
  topAvatarFallback: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1ABC9C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topAvatarLetter: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  logoutBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F1F3F5',
  },
  pressed: {
    opacity: 0.8,
  },
});
