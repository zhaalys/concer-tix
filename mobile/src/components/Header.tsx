import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from './themed-text';
import { useAuth } from '@/lib/auth-context';
import { resolveImage } from '@/lib/assets';
import { useTheme } from '@/hooks/use-theme';

export function Header() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const router = useRouter();
  const { user } = useAuth();

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
      <Pressable onPress={() => router.push('/' as never)} style={styles.brandContainer}>
        <Image
          source={resolveImage('/logo/tix_logo.png')}
          style={styles.logo}
          contentFit="contain"
          transition={0}
        />
        <ThemedText style={styles.logoText}>Concer TIX</ThemedText>
      </Pressable>

      {/* Right Controls */}
      <View style={styles.rightControls}>
        {/* Search Icon Button */}
        <Pressable
          onPress={() => router.push('/explore' as never)}
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
          onPress={() => router.push('/profile' as never)}
          style={({ pressed }) => [
            styles.avatarBtn,
            { backgroundColor: '#0E9375' },
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
    gap: 8,
  },
  logo: {
    width: 34,
    height: 34,
  },
  logoText: {
    fontSize: 19,
    fontWeight: '800',
    color: '#0E9375',
    letterSpacing: -0.5,
  },
  rightControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
