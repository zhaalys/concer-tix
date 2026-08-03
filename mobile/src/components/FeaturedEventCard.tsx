import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from './themed-text';

export interface FeaturedEvent {
  id: string;
  title: string;
  location: string;
  price: string;
  imageUrl: string;
  tags: { label: string; type: 'secondary' | 'translucent' }[];
}

const DEFAULT_FEATURED: FeaturedEvent = {
  id: 'feat-1',
  title: 'Sound of Downtown Vol. 5',
  location: 'Lapangan Pussenif, Bandung',
  price: 'Rp 185.000',
  imageUrl:
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=1000',
  tags: [
    { label: 'TRENDING', type: 'secondary' },
    { label: 'MUSIK', type: 'translucent' },
  ],
};

interface FeaturedEventCardProps {
  event?: FeaturedEvent;
  onPressBook?: () => void;
}

export function FeaturedEventCard({
  event = DEFAULT_FEATURED,
  onPressBook,
}: FeaturedEventCardProps) {
  return (
    <View style={styles.cardContainer}>
      <Image
        source={{ uri: event.imageUrl }}
        style={styles.imageBackground}
        contentFit="cover"
        transition={300}
      />
      <LinearGradient
        colors={['transparent', 'rgba(11, 26, 61, 0.4)', 'rgba(11, 26, 61, 0.92)']}
        style={styles.gradientOverlay}
      />

      <View style={styles.contentContainer}>
        {/* Tags */}
        <View style={styles.tagRow}>
          {event.tags.map((tag, idx) => (
            <View
              key={idx}
              style={[
                styles.tagPill,
                tag.type === 'secondary'
                  ? styles.secondaryTag
                  : styles.translucentTag,
              ]}>
              <ThemedText style={styles.tagText}>{tag.label}</ThemedText>
            </View>
          ))}
        </View>

        {/* Title */}
        <ThemedText
          type="headlineLg"
          numberOfLines={1}
          style={styles.titleText}>
          {event.title}
        </ThemedText>

        {/* Location */}
        <View style={styles.locationRow}>
          <MaterialIcons name="location-on" size={16} color="rgba(255,255,255,0.85)" />
          <ThemedText style={styles.locationText} numberOfLines={1}>
            {event.location}
          </ThemedText>
        </View>

        {/* Price & Book Button */}
        <View style={styles.bottomRow}>
          <ThemedText type="priceTag" style={styles.priceText}>
            {event.price}
          </ThemedText>
          <Pressable
            onPress={onPressBook}
            style={({ pressed }) => [
              styles.bookButton,
              pressed && styles.buttonPressed,
            ]}>
            <ThemedText type="labelMd" style={styles.buttonText}>
              Pesan Sekarang
            </ThemedText>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: '100%',
    height: 256,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#0b1a3d',
  },
  imageBackground: {
    ...StyleSheet.absoluteFill,
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFill,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 18,
  },
  tagRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  tagPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  secondaryTag: {
    backgroundColor: '#a33800',
  },
  translucentTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  tagText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  titleText: {
    color: '#FFFFFF',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 14,
  },
  locationText: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 14,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceText: {
    color: '#FFFFFF',
  },
  bookButton: {
    backgroundColor: '#0e3ec7',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    shadowColor: '#0e3ec7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonPressed: {
    transform: [{ scale: 0.95 }],
    opacity: 0.9,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
