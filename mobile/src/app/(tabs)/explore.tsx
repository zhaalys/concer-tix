import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
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

  const cityOptions = [
    { id: 'semua', label: 'All Cities' },
    ...CITIES.map((c) => ({ id: c.id, label: c.name })),
  ];

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

        {/* Filter dropdowns */}
        <View style={styles.filterRow}>
          <FilterButton
            label={category}
            active={category !== 'All'}
            options={EXPLORE_CATEGORIES}
            value={category}
            onChange={setCategory}
          />
          <FilterButton
            label={cityOptions.find((o) => o.id === cityId)?.label ?? 'All Cities'}
            active={cityId !== 'semua'}
            options={cityOptions}
            value={cityId}
            onChange={setCityId}
          />
          <FilterButton
            label={SORT_OPTIONS.find((o) => o.id === sortBy)?.label ?? 'Urutkan'}
            active={sortBy !== 'popular'}
            options={[...SORT_OPTIONS]}
            value={sortBy}
            onChange={(id) => setSortBy(id as SortOption)}
          />
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

interface FilterButtonProps {
  label: string;
  active: boolean;
  options: { id: string; label: string }[] | string[];
  value: string;
  onChange: (id: string) => void;
}

function FilterButton({ label, active, options, value, onChange }: FilterButtonProps) {
  const [open, setOpen] = useState(false);
  const list = options.map((opt) =>
    typeof opt === 'string' ? { id: opt, label: opt } : opt
  );

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        style={({ pressed }) => [styles.filterBtn, active && styles.filterBtnActive, pressed && styles.pressed]}>
        <ThemedText numberOfLines={1} style={[styles.filterText, active && styles.filterTextActive]}>
          {label}
        </ThemedText>
        <MaterialIcons name="keyboard-arrow-down" size={16} color={active ? '#0E9375' : '#495057'} />
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          <View style={styles.menu}>
            <ScrollView style={styles.menuList} keyboardShouldPersistTaps="handled">
              {list.map((opt) => (
                <Pressable
                  key={opt.id}
                  onPress={() => {
                    onChange(opt.id);
                    setOpen(false);
                  }}
                  style={[styles.menuItem, value === opt.id && styles.menuItemActive]}>
                  <ThemedText style={[styles.menuText, value === opt.id && styles.menuTextActive]}>
                    {opt.label}
                  </ThemedText>
                  {value === opt.id && <MaterialIcons name="check" size={16} color="#0E9375" />}
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </>
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
  filterRow: {
    flexDirection: 'row',
    gap: 8,
  },
  filterBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 4,
    height: 40,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DEE2E6',
  },
  filterBtnActive: {
    borderColor: '#0E9375',
    backgroundColor: '#E6F7F4',
  },
  filterText: {
    flex: 1,
    fontSize: 11,
    fontWeight: '600',
    color: '#495057',
  },
  filterTextActive: {
    color: '#0E9375',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menu: {
    width: '80%',
    maxWidth: 320,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    overflow: 'hidden',
    paddingVertical: 4,
  },
  menuList: {
    flexGrow: 0,
    maxHeight: 320,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F5',
  },
  menuItemActive: {
    backgroundColor: '#F7FDFB',
  },
  menuText: {
    fontSize: 13,
    color: '#1A1D2E',
  },
  menuTextActive: {
    color: '#0E9375',
    fontWeight: '700',
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
    gap: 10,
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
  pressed: {
    opacity: 0.8,
  },
});
