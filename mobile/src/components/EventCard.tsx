import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppImage } from './AppImage';
import { ThemedText } from './themed-text';
import { useTheme } from '@/hooks/use-theme';
import { formatPrice } from '@/lib/format';
import type { Event } from '@/lib/types';

interface EventCardProps {
  event: Event;
  horizontal?: boolean;
}

export function EventCard({ event, horizontal }: EventCardProps) {
  const theme = useTheme();
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push(`/event/${event.id}` as never)}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: '#FFFFFF', borderColor: '#E9ECEF' },
        pressed && styles.pressed,
      ]}>
      <View style={[styles.imageWrap, horizontal && styles.imageWrapH]}>
        <AppImage src={event.image_url} style={[styles.image, horizontal && styles.imageH]} radius={horizontal ? 8 : 12} />
        {event.is_hot && (
          <View style={styles.badge}>
            <ThemedText style={styles.badgeText}>HOT</ThemedText>
          </View>
        )}
      </View>
      <View style={styles.info}>
        <ThemedText numberOfLines={1} style={styles.title}>
          {event.title}
        </ThemedText>
        <View style={styles.metaRow}>
          <MaterialIcons name="calendar-month" size={14} color={theme.primary} />
          <ThemedText numberOfLines={1} style={styles.metaText}>
            {event.event_date}
          </ThemedText>
        </View>
        <View style={styles.divider} />
        <View style={styles.footerRow}>
          <ThemedText style={styles.price}>{formatPrice(event.numericPrice ?? 0)}</ThemedText>
          <View style={styles.organizerRow}>
            <AppImage src={event.organizer_logo} style={styles.organizerLogo} radius={14} />
            <ThemedText numberOfLines={1} style={styles.organizerText}>
              {event.organizer}
            </ThemedText>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  imageWrap: {
    width: '100%',
    aspectRatio: 16 / 10,
    position: 'relative',
  },
  imageWrapH: {
    aspectRatio: 4 / 3,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageH: {
    width: '100%',
    height: '100%',
  },
  badge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#1ABC9C',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  info: {
    padding: 12,
    gap: 6,
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1A1D2E',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#495057',
  },
  divider: {
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    borderStyle: 'dashed',
    marginVertical: 2,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0E9375',
    flexShrink: 1,
  },
  organizerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 1,
  },
  organizerLogo: {
    width: 22,
    height: 22,
  },
  organizerText: {
    fontSize: 12,
    color: '#495057',
    fontWeight: '500',
    flexShrink: 1,
  },
  pressed: {
    opacity: 0.85,
  },
});
