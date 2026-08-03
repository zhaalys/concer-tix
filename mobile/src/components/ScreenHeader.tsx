import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from './themed-text';

interface ScreenHeaderProps {
  title?: string;
  subtitle?: string;
  onBack?: () => void;
  right?: React.ReactNode;
}

export function ScreenHeader({ title, subtitle, onBack, right }: ScreenHeaderProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={[styles.header, { paddingTop: Math.max(insets.top, 12) }]}>
      <Pressable
        onPress={onBack ?? (() => router.back())}
        style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}
        hitSlop={8}>
        <MaterialIcons name="arrow-back" size={22} color="#1A1D2E" />
      </Pressable>
      <View style={styles.titles}>
        {title && (
          <ThemedText style={styles.title} numberOfLines={1}>
            {title}
          </ThemedText>
        )}
        {subtitle && (
          <ThemedText style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </ThemedText>
        )}
      </View>
      <View style={styles.right}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 10,
    minHeight: 56,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.06)',
    backgroundColor: '#FFFFFF',
  },
  backBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F4F6FC',
  },
  titles: {
    flex: 1,
    marginLeft: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1D2E',
  },
  subtitle: {
    fontSize: 12,
    color: '#868E96',
  },
  right: {
    minWidth: 34,
    alignItems: 'flex-end',
  },
  pressed: {
    opacity: 0.7,
  },
});
