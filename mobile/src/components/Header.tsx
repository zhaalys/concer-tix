import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from './themed-text';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export function Header() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const router = useRouter();
  const [lang, setLang] = useState<'ID' | 'EN'>('ID');

  const toggleLanguage = () => {
    setLang(lang === 'ID' ? 'EN' : 'ID');
  };

  return (
    <View
      style={[
        styles.header,
        {
          paddingTop: Math.max(insets.top, 12),
          backgroundColor: '#FFFFFF',
        },
      ]}>
      {/* Brand Logo */}
      <Pressable onPress={() => router.push('/')} style={styles.brandContainer}>
        <ThemedText style={styles.logoText}>Artatix</ThemedText>
      </Pressable>

      {/* Right Controls */}
      <View style={styles.rightControls}>
        {/* Language Selector */}
        <Pressable
          onPress={toggleLanguage}
          style={({ pressed }) => [
            styles.langPill,
            { backgroundColor: '#F4F6FC' },
            pressed && styles.pressed,
          ]}>
          <MaterialIcons name="language" size={16} color={theme.textSecondary} />
          <ThemedText type="labelMd" style={{ color: theme.textSecondary }}>
            {lang}
          </ThemedText>
        </Pressable>

        {/* Search Icon Button */}
        <Pressable
          onPress={() => router.push('/explore')}
          style={({ pressed }) => [
            styles.iconBtn,
            { backgroundColor: '#F4F6FC' },
            pressed && styles.pressed,
          ]}
          hitSlop={8}>
          <MaterialIcons name="search" size={20} color={theme.textSecondary} />
        </Pressable>

        {/* Profile Avatar Button */}
        <Pressable
          onPress={() => router.push('/profile')}
          style={({ pressed }) => [
            styles.avatarBtn,
            { backgroundColor: Colors.light.primary },
            pressed && styles.pressed,
          ]}>
          <MaterialIcons name="person" size={18} color="#FFFFFF" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 68,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    zIndex: 50,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0e3ec7',
    letterSpacing: -0.5,
  },
  rightControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  langPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  iconBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
});
