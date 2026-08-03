import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { AppImage } from '@/components/AppImage';
import { EventCard } from '@/components/EventCard';
import { HeroCarousel } from '@/components/HeroCarousel';
import { HomeIconScroll } from '@/components/HomeIconScroll';
import { SectionHeader } from '@/components/SectionHeader';
import { ThemedText } from '@/components/themed-text';
import { EVENT_SERU, HOME_CITIES, PROMO_BANNER, type StaticEvent } from '@/lib/content';
import { formatPrice } from '@/lib/format';
import { usePublicEvents } from '@/lib/useEvents';

export default function HomeScreen() {
  const router = useRouter();
  const { events, loading } = usePublicEvents();

  const topEvents = events.slice(0, 5);

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <HeroCarousel />
      </View>

      <HomeIconScroll />

      <View style={styles.section}>
        <SectionHeader title="Top Events For You" actionLabel="See All" actionHref="/explore" />
      </View>

      {loading ? (
        <ActivityIndicator color="#0E9375" style={styles.loader} />
      ) : events.length === 0 ? (
        <ThemedText style={styles.empty}>Belum ada event untuk ditampilkan.</ThemedText>
      ) : (
        <View style={styles.eventsColumn}>
          {topEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </View>
      )}

      <View style={styles.section}>
        <AppImage src={PROMO_BANNER} style={styles.promo} radius={20} />
      </View>

      <View style={styles.section}>
        <SectionHeader title="Event Seru" actionLabel="See All" actionHref="/explore" />
      </View>
      <View style={styles.grid}>
        {EVENT_SERU.map((ev) => (
          <SeruCard
            key={ev.id}
            event={ev}
            onPress={() => router.push(`/event/${ev.id}` as never)}
          />
        ))}
      </View>

      <View style={styles.section}>
        <SectionHeader title="Find Exciting Events Near You!" actionLabel="See All Cities" actionHref="/explore" />
      </View>
      <View style={styles.citiesRow}>
        {HOME_CITIES.map((city) => (
          <Pressable
            key={city.name}
            onPress={() => router.push(`/explore?kota=${encodeURIComponent(city.name)}` as never)}
            style={({ pressed }) => [styles.cityItem, pressed && styles.pressed]}>
            <AppImage src={city.img} style={styles.cityImg} radius={12} />
            <ThemedText numberOfLines={1} style={styles.cityLabel}>
              {city.name}
            </ThemedText>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

function SeruCard({ event, onPress }: { event: StaticEvent; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.seruCard, pressed && styles.pressed]}>
      <AppImage src="/image_concer/banner_concer_1.png" style={styles.seruImg} radius={12} />
      <ThemedText numberOfLines={1} style={styles.seruTitle}>
        {event.title}
      </ThemedText>
      <View style={styles.seruMeta}>
        <MaterialIcons name="calendar-month" size={13} color="#0E9375" />
        <ThemedText numberOfLines={1} style={styles.seruDate}>
          {event.date}
        </ThemedText>
      </View>
      <ThemedText numberOfLines={1} style={styles.seruPrice}>
        {formatPrice(event.price)}
      </ThemedText>
      <View style={styles.seruDivider} />
      <View style={styles.seruOrganizer}>
        <AppImage src="/logo/tix_logo.png" style={styles.seruLogo} radius={14} />
        <ThemedText numberOfLines={1} style={styles.seruOrgText}>
          {event.organizer}
        </ThemedText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    paddingBottom: 90,
    gap: 20,
  },
  section: {
    marginTop: 4,
  },
  loader: {
    marginVertical: 24,
  },
  empty: {
    fontSize: 14,
    color: '#868E96',
    textAlign: 'center',
    paddingVertical: 24,
  },
  eventsColumn: {
    gap: 14,
  },
  promo: {
    width: '100%',
    height: 140,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  seruCard: {
    width: '48.5%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    padding: 8,
    gap: 5,
  },
  seruImg: {
    width: '100%',
    aspectRatio: 16 / 10,
  },
  seruTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A1D2E',
  },
  seruMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  seruDate: {
    fontSize: 11,
    color: '#495057',
  },
  seruPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0E9375',
  },
  seruDivider: {
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    borderStyle: 'dashed',
  },
  seruOrganizer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  seruLogo: {
    width: 20,
    height: 20,
  },
  seruOrgText: {
    fontSize: 11,
    color: '#495057',
    flex: 1,
  },
  citiesRow: {
    flexDirection: 'row',
    marginHorizontal: -16,
    paddingHorizontal: 16,
    gap: 10,
  },
  cityItem: {
    width: 110,
    gap: 4,
  },
  cityImg: {
    width: 110,
    height: 74,
  },
  cityLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1D2E',
  },
  pressed: {
    opacity: 0.8,
  },
});
