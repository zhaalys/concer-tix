import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { EventCard } from '@/components/EventCard';
import { ThemedText } from '@/components/themed-text';
import { CITIES, EXPLORE_CATEGORIES, SORT_OPTIONS, type SortOption } from '@/lib/content';
import { usePublicEvents } from '@/lib/useEvents';
import type { Event } from '@/lib/types';

export default function ExploreScreen() {
  const params = useLocalSearchParams<{ q?: string; kota?: string; category?: string }>();
  const { events, loading } = usePublicEvents();

  const [query, setQuery] = useState(params.q ?? '');
  const [category, setCategory] = useState(params.category ?? 'All');
  const [cityId, setCityId] = useState(
    params.kota ? CITIES.find((c) => c.name.toLowerCase() === (params.kota ?? '').toLowerCase())?.id ?? 'semua' : 'semua'
  );
  const [sortBy, setSortBy] = useState<SortOption>('popular');

  const city = CITIES.find((c) => c.id === cityId);

  const filtered = useMemo(() => {
    let list = [...events];
    if (category !== 'All') {
      list = list.filter((e) => e.category === category);
    }
    if (cityId !== 'semua' && city) {
      const words = city.name.toLowerCase().split(/[\s,&]+/).filter(Boolean);
      list = list.filter((e) => {
        const hay = `${e.city} ${e.city_label ?? ''} ${e.location ?? ''}`.toLowerCase();
        return words.some((w) => hay.includes(w)) || hay.includes(city.name.toLowerCase());
      });
    }
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (e) => e.title.toLowerCase().includes(q) || (e.location ?? '').toLowerCase().includes(q)
      );
    }
    if (sortBy === 'price_low') list.sort((a, b) => (a.numericPrice ?? 0) - (b.numericPrice ?? 0));
    if (sortBy === 'price_high') list.sort((a, b) => (b.numericPrice ?? 0) - (a.numericPrice ?? 0));
    return list;
  }, [events, category, cityId, city, query, sortBy]);

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled">
        {/* Search */}
        <View style={styles.searchWrap}>
          <View style={styles.searchBar}>
            <MaterialIcons name="search" size={20} color="#868E96" />
            <TextInput
              style={styles.searchInput}
              placeholder="Cari konser, festival, atau venue..."
              placeholderTextColor="#868E96"
              value={query}
              onChangeText={setQuery}
            />
            {query.length > 0 && (
              <Pressable onPress={() => setQuery('')} hitSlop={8}>
                <MaterialIcons name="close" size={18} color="#868E96" />
              </Pressable>
            )}
          </View>
        </View>

        {/* Category chips */}
        <View style={styles.chipsRow}>
          {EXPLORE_CATEGORIES.map((cat) => {
            const active = category === cat;
            return (
              <Pressable
                key={cat}
                onPress={() => setCategory(cat)}
                style={[styles.chip, active && styles.chipActive]}>
                <ThemedText style={[styles.chipText, active && styles.chipTextActive]}>
                  {cat}
                </ThemedText>
              </Pressable>
            );
          })}
        </View>

        {/* City chips */}
        <View style={styles.cityRow}>
          {[{ id: 'semua', name: 'All Cities', label: '' } as any, ...CITIES].map((c: any) => {
            const active = cityId === c.id;
            return (
              <Pressable
                key={c.id}
                onPress={() => setCityId(c.id)}
                style={[styles.cityChip, active && styles.cityChipActive]}>
                <ThemedText style={[styles.cityChipText, active && styles.cityChipTextActive]}>
                  {c.name}
                </ThemedText>
              </Pressable>
            );
          })}
        </View>

        {/* Sort */}
        <View style={styles.sortRow}>
          <ThemedText style={styles.sortLabel}>Urutkan:</ThemedText>
          <View style={styles.sortPills}>
            {SORT_OPTIONS.map((opt) => (
              <Pressable
                key={opt.id}
                onPress={() => setSortBy(opt.id)}
                style={[styles.sortPill, sortBy === opt.id && styles.sortPillActive]}>
                <ThemedText style={[styles.sortPillText, sortBy === opt.id && styles.sortPillTextActive]}>
                  {opt.label}
                </ThemedText>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Header */}
        <View style={styles.header}>
          <ThemedText style={styles.headerTitle}>
            {city && cityId !== 'semua' ? `Event di ${city.name}` : 'Daftar Semua Event'}
          </ThemedText>
          <ThemedText style={styles.headerSub}>Menampilkan {filtered.length} event pilihan</ThemedText>
        </View>

        {/* List */}
        {loading ? (
          <ActivityIndicator color="#0E9375" style={styles.loader} />
        ) : filtered.length === 0 ? (
          <EmptyState />
        ) : (
          <View style={styles.grid}>
            {filtered.map((e: Event) => (
              <EventCard key={e.id} event={e} />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function EmptyState() {
  return (
    <View style={styles.empty}>
      <View style={styles.emptyCircle}>
        <MaterialIcons name="search-off" size={32} color="#E8590C" />
      </View>
      <ThemedText style={styles.emptyTitle}>Tidak Ada Event Ditemukan</ThemedText>
      <ThemedText style={styles.emptyText}>
        Maaf, belum ada event yang cocok dengan kriteria pencarian atau kategori yang Anda pilih.
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FB',
  },
  content: {
    padding: 16,
    paddingBottom: 90,
    gap: 14,
  },
  searchWrap: {
    marginTop: 4,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1A1D2E',
    paddingVertical: 0,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DEE2E6',
  },
  chipActive: {
    backgroundColor: '#0E9375',
    borderColor: '#0E9375',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#495057',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  cityRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  cityChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DEE2E6',
  },
  cityChipActive: {
    backgroundColor: '#E6F7F4',
    borderColor: '#0E9375',
  },
  cityChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#495057',
  },
  cityChipTextActive: {
    color: '#0E9375',
  },
  sortRow: {
    gap: 8,
  },
  sortLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#495057',
  },
  sortPills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sortPill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DEE2E6',
  },
  sortPillActive: {
    backgroundColor: '#1A1D2E',
    borderColor: '#1A1D2E',
  },
  sortPillText: {
    fontSize: 12,
    color: '#495057',
  },
  sortPillTextActive: {
    color: '#FFFFFF',
  },
  header: {
    marginTop: 4,
    gap: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1D2E',
  },
  headerSub: {
    fontSize: 12,
    color: '#868E96',
  },
  loader: {
    marginVertical: 32,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 10,
  },
  emptyCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FFF9DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1D2E',
  },
  emptyText: {
    fontSize: 13,
    color: '#868E96',
    textAlign: 'center',
    lineHeight: 19,
    paddingHorizontal: 24,
  },
});
