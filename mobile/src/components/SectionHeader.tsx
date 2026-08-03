import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from './themed-text';

interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  actionHref?: string;
}

export function SectionHeader({ title, actionLabel, actionHref }: SectionHeaderProps) {
  const router = useRouter();
  return (
    <View style={styles.row}>
      <ThemedText style={styles.title}>{title}</ThemedText>
      {actionLabel && actionHref && (
        <Pressable
          onPress={() => router.push(actionHref as never)}
          style={({ pressed }) => [styles.link, pressed && styles.pressed]}>
          <ThemedText style={styles.linkText}>{actionLabel}</ThemedText>
          <MaterialIcons name="chevron-right" size={16} color="#0E9375" />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1D2E',
  },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  linkText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0E9375',
  },
  pressed: {
    opacity: 0.7,
  },
});
