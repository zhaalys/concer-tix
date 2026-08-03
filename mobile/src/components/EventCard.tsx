import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from './themed-text';
import { useTheme } from '@/hooks/use-theme';

export interface EventItem {
  id: string;
  title: string;
  meta: string;
  metaIcon: 'location-on' | 'schedule';
  price: string;
  dateMonth: string;
  dateDay: string;
  imageUrl: string;
}

interface EventCardProps {
  event: EventItem;
  onPress?: () => void;
}

export function EventCard({ event, onPress }: EventCardProps) {
  const theme = useTheme();
  const [isLiked, setIsLiked] = useState(false);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: theme.surfaceContainerLowest },
        pressed && styles.pressed,
      ]}>
      {/* Left Image Section */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: event.imageUrl }}
          style={styles.image}
          contentFit="cover"
          transition={200}
        />
        {/* Date Badge Overlay */}
        <View style={styles.dateBadge}>
          <ThemedText style={styles.dateMonthText}>{event.dateMonth}</ThemedText>
          <ThemedText style={styles.dateDayText}>{event.dateDay}</ThemedText>
        </View>
      </View>

      {/* Right Info Section */}
      <View style={styles.infoContainer}>
        <View>
          <ThemedText
            type="headlineMd"
            numberOfLines={1}
            style={[styles.title, { color: theme.text }]}>
            {event.title}
          </ThemedText>

          <View style={styles.metaRow}>
            <MaterialIcons
              name={event.metaIcon}
              size={15}
              color={theme.primary}
            />
            <ThemedText
              type="bodyMd"
              numberOfLines={1}
              style={[styles.metaText, { color: theme.textSecondary }]}>
              {event.meta}
            </ThemedText>
          </View>
        </View>

        {/* Footer Row */}
        <View
          style={[
            styles.footerRow,
            { borderTopColor: theme.surfaceContainerHigh },
          ]}>
          <ThemedText type="priceTag" style={{ color: theme.primary }}>
            {event.price}
          </ThemedText>

          <Pressable
            onPress={() => setIsLiked(!isLiked)}
            style={({ pressed }) => [
              styles.favoriteBtn,
              { backgroundColor: theme.surfaceContainerLow },
              pressed && styles.pressed,
            ]}
            hitSlop={8}>
            <MaterialIcons
              name={isLiked ? 'favorite' : 'favorite-border'}
              size={18}
              color={isLiked ? '#ba1a1a' : theme.textSecondary}
            />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    height: 124,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  imageContainer: {
    width: '35%',
    height: '100%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  dateBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
  },
  dateMonthText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#444654',
    textTransform: 'uppercase',
  },
  dateDayText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0b1a3d',
    lineHeight: 17,
  },
  infoContainer: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  title: {
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    flex: 1,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
  },
  favoriteBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.8,
  },
});
