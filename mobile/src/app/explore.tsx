import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { EventCard, EventItem } from '@/components/EventCard';
import { EventDetailModal } from '@/components/EventDetailModal';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';

const EXPLORE_CATEGORIES = [
  { id: 'music', title: 'Konser Musik', count: '128 Events', icon: 'music-note', color: '#0e3ec7' },
  { id: 'art', title: 'Pameran Seni', count: '45 Events', icon: 'palette', color: '#a33800' },
  { id: 'sports', title: 'Olahraga', count: '32 Events', icon: 'sports-soccer', color: '#00875a' },
  { id: 'seminar', title: 'Seminar & Tech', count: '64 Events', icon: 'school', color: '#6b38fb' },
];

const PRICE_FILTERS = [
  { id: 'all', label: 'Semua Harga' },
  { id: 'free', label: 'Gratis' },
  { id: 'under100', label: '< Rp 100rb' },
  { id: 'mid', label: 'Rp 100rb - 500rb' },
];

const ALL_EXPLORE_EVENTS: (EventItem & { category: string; rawPrice: number })[] = [
  {
    id: 'sound-of-downtown',
    title: 'Sound of Downtown Vol. 5',
    meta: 'Lapangan Pussenif, Bandung',
    metaIcon: 'location-on',
    price: 'Rp 185.000',
    rawPrice: 185000,
    dateMonth: 'AUG',
    dateDay: '28',
    category: 'music',
    imageUrl:
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'exp-2',
    title: 'Nusantara Jazz Festival',
    meta: 'Candi Prambanan, Yogyakarta',
    metaIcon: 'location-on',
    price: 'Rp 350.000',
    rawPrice: 350000,
    dateMonth: 'SEP',
    dateDay: '10',
    category: 'music',
    imageUrl:
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'evt-1',
    title: 'Jakarta Contemporary Art Expo',
    meta: 'Galeri Nasional, Jakarta',
    metaIcon: 'location-on',
    price: 'Rp 75.000',
    rawPrice: 75000,
    dateMonth: 'AUG',
    dateDay: '15',
    category: 'art',
    imageUrl:
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'evt-3',
    title: 'Indonesia Esports Summit',
    meta: 'ICE BSD, Tangerang',
    metaIcon: 'location-on',
    price: 'Gratis',
    rawPrice: 0,
    dateMonth: 'OCT',
    dateDay: '20',
    category: 'sports',
    imageUrl:
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800',
  },
];

export default function ExploreScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [selectedPrice, setSelectedPrice] = useState('all');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const filteredEvents = ALL_EXPLORE_EVENTS.filter((evt) => {
    const matchesCat = selectedCat === 'all' || evt.category === selectedCat;
    const matchesSearch =
      search.trim() === '' ||
      evt.title.toLowerCase().includes(search.toLowerCase()) ||
      evt.meta.toLowerCase().includes(search.toLowerCase());

    let matchesPrice = true;
    if (selectedPrice === 'free') matchesPrice = evt.rawPrice === 0;
    else if (selectedPrice === 'under100') matchesPrice = evt.rawPrice > 0 && evt.rawPrice < 100000;
    else if (selectedPrice === 'mid') matchesPrice = evt.rawPrice >= 100000 && evt.rawPrice <= 500000;

    return matchesCat && matchesSearch && matchesPrice;
  });

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <ScrollView
        style={[styles.scrollView, { backgroundColor: '#FFFFFF' }]}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        {/* Title */}
        <View style={styles.headerTitleContainer}>
          <ThemedText type="headlineXl" style={{ color: theme.text }}>
            Jelajah Event
          </ThemedText>
          <ThemedText type="bodyMd" style={{ color: theme.textSecondary }}>
            Temukan hiburan & pengalaman budaya terbaik di Indonesia.
          </ThemedText>
        </View>

        {/* Search Input */}
        <View style={[styles.searchWrapper, { backgroundColor: '#F4F6FC' }]}>
          <MaterialIcons name="search" size={20} color={theme.outline} />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Cari nama event, artis, atau lokasi..."
            placeholderTextColor={theme.outline}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch('')} hitSlop={8}>
              <MaterialIcons name="cancel" size={18} color={theme.outline} />
            </Pressable>
          )}
        </View>

        {/* Grid Categories */}
        <View style={styles.gridContainer}>
          {EXPLORE_CATEGORIES.map((cat) => {
            const isSelected = selectedCat === cat.id;

            return (
              <Pressable
                key={cat.id}
                onPress={() => setSelectedCat(isSelected ? 'all' : cat.id)}
                style={({ pressed }) => [
                  styles.categoryCard,
                  {
                    backgroundColor: isSelected
                      ? 'rgba(14, 62, 199, 0.08)'
                      : '#FFFFFF',
                    borderColor: isSelected ? '#0e3ec7' : 'rgba(0,0,0,0.06)',
                  },
                  pressed && styles.pressed,
                ]}>
                <View style={[styles.iconBox, { backgroundColor: `${cat.color}15` }]}>
                  <MaterialIcons
                    name={cat.icon as keyof typeof MaterialIcons.glyphMap}
                    size={24}
                    color={cat.color}
                  />
                </View>
                <ThemedText
                  type="headlineMd"
                  style={[
                    styles.catTitle,
                    { color: isSelected ? '#0e3ec7' : theme.text },
                  ]}>
                  {cat.title}
                </ThemedText>
                <ThemedText type="labelMd" style={{ color: theme.textSecondary }}>
                  {cat.count}
                </ThemedText>
              </Pressable>
            );
          })}
        </View>

        {/* Price Filter Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.priceFilterRow}>
          {PRICE_FILTERS.map((pf) => {
            const isSel = selectedPrice === pf.id;

            return (
              <Pressable
                key={pf.id}
                onPress={() => setSelectedPrice(pf.id)}
                style={[
                  styles.pricePill,
                  isSel ? styles.activePricePill : styles.inactivePricePill,
                ]}>
                <ThemedText
                  type="labelMd"
                  style={{ color: isSel ? '#FFFFFF' : theme.textSecondary }}>
                  {pf.label}
                </ThemedText>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Results Header */}
        <View style={styles.resultsHeader}>
          <ThemedText type="headlineMd" style={{ color: theme.text }}>
            {selectedCat !== 'all' ? 'Hasil Filter' : 'Semua Rekomendasi'}
          </ThemedText>
          <ThemedText type="labelMd" style={{ color: theme.textSecondary }}>
            {filteredEvents.length} Event
          </ThemedText>
        </View>

        {/* Event Cards */}
        <View style={styles.eventList}>
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onPress={() => setSelectedEventId(event.id)}
              />
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <MaterialIcons name="event-busy" size={42} color={theme.outline} />
              <ThemedText type="headlineMd" style={{ color: theme.textSecondary }}>
                Tidak ada event yang cocok dengan filter kamu
              </ThemedText>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Event Detail Modal Overlay */}
      <EventDetailModal
        eventId={selectedEventId}
        onClose={() => setSelectedEventId(null)}
        onSuccessOrder={() => router.push('/tickets')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 90,
    gap: 16,
    backgroundColor: '#FFFFFF',
  },
  headerTitleContainer: {
    gap: 4,
    marginTop: 4,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 46,
    borderRadius: 14,
    paddingHorizontal: 14,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    width: '48%',
    padding: 14,
    borderRadius: 16,
    gap: 6,
    borderWidth: 1,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  catTitle: {
    fontSize: 15,
  },
  priceFilterRow: {
    gap: 8,
    paddingVertical: 2,
  },
  pricePill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
  },
  activePricePill: {
    backgroundColor: '#0e3ec7',
  },
  inactivePricePill: {
    backgroundColor: '#F4F6FC',
  },
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  eventList: {
    gap: 14,
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    gap: 8,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
});
