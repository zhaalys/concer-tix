import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppImage } from './AppImage';
import { ThemedText } from './themed-text';
import { formatPrice } from '@/lib/format';
import type { Event } from '@/lib/types';

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push(`/event/${event.id}` as never)}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.imageWrap}>
        <AppImage src={event.image_url} style={styles.image} radius={12} />
      </View>
      <ThemedText numberOfLines={1} style={styles.title}>
        {event.title}
      </ThemedText>
      <View style={styles.metaRow}>
        <MaterialIcons name="calendar-month" size={13} color="#0E9375" />
        <ThemedText numberOfLines={1} style={styles.metaText}>
          {event.event_date}
        </ThemedText>
      </View>
      <ThemedText numberOfLines={1} style={styles.price}>
        {formatPrice(event.numericPrice ?? 0)}
      </ThemedText>
      <View style={styles.divider} />
      <View style={styles.organizerRow}>
        <AppImage src={event.organizer_logo} style={styles.organizerLogo} radius={14} />
        <ThemedText numberOfLines={1} style={styles.organizerText}>
          {event.organizer}
        </ThemedText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48.5%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    padding: 8,
    gap: 5,
  },
  imageWrap: {
    width: '100%',
    aspectRatio: 16 / 10,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A1D2E',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 11,
    color: '#495057',
    flexShrink: 1,
  },
  price: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0E9375',
  },
  divider: {
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    borderStyle: 'dashed',
  },
  organizerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  organizerLogo: {
    width: 20,
    height: 20,
  },
  organizerText: {
    fontSize: 11,
    color: '#495057',
    flex: 1,
  },
  pressed: {
    opacity: 0.8,
  },
});
