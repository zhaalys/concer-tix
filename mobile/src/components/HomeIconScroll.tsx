import { ScrollView, StyleSheet, View } from 'react-native';

import { AppImage } from './AppImage';
import { ThemedText } from './themed-text';
import { HOME_ICONS } from '@/lib/content';

export function HomeIconScroll() {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.content}>
        {HOME_ICONS.map((item) => (
          <View key={item.icon} style={styles.item}>
            <AppImage src={item.img} style={styles.icon} contentFit="contain" />
            <ThemedText numberOfLines={1} style={styles.label}>
              {item.label}
            </ThemedText>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: -16,
  },
  content: {
    paddingHorizontal: 16,
    gap: 20,
  },
  item: {
    alignItems: 'center',
    gap: 6,
    width: 72,
  },
  icon: {
    width: 56,
    height: 56,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: '#495057',
    textAlign: 'center',
  },
});
