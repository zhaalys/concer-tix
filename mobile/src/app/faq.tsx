import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppImage } from '@/components/AppImage';
import { ScreenHeader } from '@/components/ScreenHeader';
import { ThemedText } from '@/components/themed-text';
import { FAQ_ITEMS } from '@/lib/content';

export default function FAQScreen() {
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState<number | null>(null);

  return (
    <View style={styles.container}>
      <ScreenHeader title="FAQ" />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 40 + insets.bottom }]} showsVerticalScrollIndicator={false}>
        <AppImage src="/banner/banner_5.png" style={styles.banner} radius={8} />
        <ThemedText style={styles.heading}>
          Frequently Asked <ThemedText style={styles.headingAccent}>Questions!</ThemedText>
        </ThemedText>

        <View style={styles.list}>
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = open === i;
            return (
              <Pressable
                key={i}
                onPress={() => setOpen(isOpen ? null : i)}
                style={({ pressed }) => [styles.item, pressed && styles.pressed]}>
                <View style={styles.itemHeader}>
                  <ThemedText style={styles.question}>{item.q}</ThemedText>
                  <View style={[styles.iconCircle, isOpen && styles.iconCircleOpen]}>
                    <MaterialIcons name="add" size={20} color={isOpen ? '#FFFFFF' : '#0E9375'} />
                  </View>
                </View>
                {isOpen && <ThemedText style={styles.answer}>{item.a}</ThemedText>}
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
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
    gap: 16,
  },
  banner: {
    width: '100%',
    aspectRatio: 16 / 7,
  },
  heading: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A1D2E',
  },
  headingAccent: {
    color: '#0E9375',
  },
  list: {
    gap: 10,
  },
  item: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    padding: 16,
    gap: 10,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  question: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1D2E',
    lineHeight: 20,
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E8F5F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircleOpen: {
    backgroundColor: '#0E9375',
    transform: [{ rotate: '45deg' }],
  },
  answer: {
    fontSize: 13,
    lineHeight: 20,
    color: '#495057',
  },
  pressed: {
    opacity: 0.9,
  },
});
