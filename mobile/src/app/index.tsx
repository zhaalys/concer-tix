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

import { CategoryChips } from '@/components/CategoryChips';
import { EmptyStateDelighter } from '@/components/EmptyStateDelighter';
import { EventCard, EventItem } from '@/components/EventCard';
import { EventDetailModal } from '@/components/EventDetailModal';
import { FeaturedEventCard } from '@/components/FeaturedEventCard';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';

const ALL_EVENTS: (EventItem & { category: string })[] = [
  {
    id: 'evt-1',
    title: 'Jakarta Contemporary Art',
    meta: 'Galeri Nasional, Jakarta',
    metaIcon: 'location-on',
    price: 'Rp 75.000',
    dateMonth: 'AUG',
    dateDay: '15',
    category: 'art',
    imageUrl:
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'evt-2',
    title: 'Masterclass: Coffee Brewing',
    meta: '10:00 - 16:00 WIB',
    metaIcon: 'schedule',
    price: 'Rp 450.000',
    dateMonth: 'SEP',
    dateDay: '02',
    category: 'seminar',
    imageUrl:
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'evt-3',
    title: 'Indo E-Sport Championship',
    meta: 'ICE BSD, Tangerang',
    metaIcon: 'location-on',
    price: 'Gratis',
    dateMonth: 'OCT',
    dateDay: '20',
    category: 'sports',
    imageUrl:
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'evt-4',
    title: 'Bandung Indie Music Fest',
    meta: 'Lembang Park, Bandung',
    metaIcon: 'location-on',
    price: 'Rp 120.000',
    dateMonth: 'NOV',
    dateDay: '05',
    category: 'music',
    imageUrl:
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800',
  },
];

export default function HomeScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const filteredEvents = ALL_EVENTS.filter((evt) => {
    const matchesCategory =
      selectedCategory === 'all' || evt.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.meta.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <ScrollView
        style={[styles.scrollView, { backgroundColor: '#FFFFFF' }]}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        {/* Search & Filter Bar */}
        <View style={styles.searchSection}>
          <View style={styles.searchBarContainer}>
            <View
              style={[
                styles.inputWrapper,
                { backgroundColor: '#F4F6FC' },
              ]}>
              <MaterialIcons
                name="search"
                size={20}
                color={theme.outline}
                style={styles.searchIcon}
              />
              <TextInput
                style={[styles.textInput, { color: theme.text }]}
                placeholder="Cari konser, pameran, atau workshop..."
                placeholderTextColor={theme.outline}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 ? (
                <Pressable
                  onPress={() => setSearchQuery('')}
                  hitSlop={8}
                  style={styles.clearBtn}>
                  <MaterialIcons name="cancel" size={18} color={theme.outline} />
                </Pressable>
              ) : (
                <Pressable
                  onPress={() => router.push('/explore')}
                  style={({ pressed }) => [
                    styles.tuneBtn,
                    { backgroundColor: 'rgba(14, 62, 199, 0.1)' },
                    pressed && styles.pressed,
                  ]}>
                  <MaterialIcons name="tune" size={18} color="#0e3ec7" />
                </Pressable>
              )}
            </View>
          </View>

          {/* Category Horizontal Chips */}
          <CategoryChips onSelectCategory={(catId) => setSelectedCategory(catId)} />
        </View>

        {/* Main Feed Content feedContainer */}
        <View style={styles.feedContainer}>
          {/* Featured Hero Banner */}
          <FeaturedEventCard
            onPressBook={() => setSelectedEventId('sound-of-downtown')}
          />

          {/* Section Header: Terdekat Untukmu */}
          <View style={styles.sectionHeader}>
            <ThemedText type="headlineMd" style={{ color: theme.text }}>
              Terdekat Untukmu
            </ThemedText>
            <Pressable
              onPress={() => router.push('/explore')}
              style={({ pressed }) => [styles.mapLink, pressed && styles.pressed]}>
              <ThemedText
                type="labelMd"
                style={{ color: '#0e3ec7', fontWeight: '600' }}>
                Lihat Peta
              </ThemedText>
              <MaterialIcons name="map" size={16} color="#0e3ec7" />
            </Pressable>
          </View>

          {/* Event List */}
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
                <MaterialIcons name="search-off" size={40} color={theme.outline} />
                <ThemedText type="headlineMd" style={{ color: theme.textSecondary }}>
                  Tidak ada event ditemukan
                </ThemedText>
              </View>
            )}
          </View>

          {/* Delighter Footer */}
          <EmptyStateDelighter />
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
    paddingBottom: 80,
  },
  searchSection: {
    paddingTop: 12,
    gap: 12,
    backgroundColor: '#FFFFFF',
  },
  searchBarContainer: {
    paddingHorizontal: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: 14,
    paddingHorizontal: 14,
  },
  searchIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '400',
    paddingVertical: 0,
  },
  tuneBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearBtn: {
    padding: 4,
  },
  feedContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 20,
    backgroundColor: '#FFFFFF',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  mapLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  eventList: {
    gap: 16,
  },
  emptyContainer: {
    paddingVertical: 32,
    alignItems: 'center',
    gap: 8,
  },
  pressed: {
    opacity: 0.7,
  },
});
