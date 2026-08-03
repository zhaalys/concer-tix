import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from './themed-text';
import { useTheme } from '@/hooks/use-theme';

export interface Category {
  id: string;
  name: string;
  icon: keyof typeof MaterialIcons.glyphMap;
}

const CATEGORIES: Category[] = [
  { id: 'all', name: 'Semua', icon: 'grid-view' },
  { id: 'music', name: 'Musik', icon: 'music-note' },
  { id: 'art', name: 'Seni', icon: 'palette' },
  { id: 'sports', name: 'Olahraga', icon: 'sports-soccer' },
  { id: 'seminar', name: 'Seminar', icon: 'school' },
];

interface CategoryChipsProps {
  onSelectCategory?: (id: string) => void;
}

export function CategoryChips({ onSelectCategory }: CategoryChipsProps) {
  const [selectedId, setSelectedId] = useState('all');
  const theme = useTheme();

  const handleSelect = (id: string) => {
    setSelectedId(id);
    onSelectCategory?.(id);
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}>
      {CATEGORIES.map((cat) => {
        const isSelected = selectedId === cat.id;

        return (
          <Pressable
            key={cat.id}
            onPress={() => handleSelect(cat.id)}
            style={({ pressed }) => [
              styles.chip,
              isSelected
                ? styles.activeChip
                : { backgroundColor: theme.surfaceContainerHigh },
              pressed && styles.pressed,
            ]}>
            <MaterialIcons
              name={cat.icon}
              size={16}
              color={isSelected ? '#FFFFFF' : theme.textSecondary}
            />
            <ThemedText
              type="labelMd"
              style={[
                styles.chipText,
                { color: isSelected ? '#FFFFFF' : theme.textSecondary },
              ]}>
              {cat.name}
            </ThemedText>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    gap: 8,
    paddingVertical: 4,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
  },
  activeChip: {
    backgroundColor: '#0e3ec7',
    shadowColor: '#0e3ec7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  chipText: {
    fontWeight: '600',
  },
  pressed: {
    transform: [{ scale: 0.96 }],
  },
});
