import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppImage } from '@/components/AppImage';
import { ScreenHeader } from '@/components/ScreenHeader';
import { ThemedText } from '@/components/themed-text';

export default function PricingScreen() {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.container}>
      <ScreenHeader title="Pricing" />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 40 + insets.bottom }]} showsVerticalScrollIndicator={false}>
        <ThemedText style={styles.title}>Biaya & Paket Promotor</ThemedText>
        <ThemedText style={styles.subtitle}>
          Skema biaya platform Concer TIX transparan 2.5% + Rp 2.000 per tiket. Event gratis 100% tanpa biaya komisi!
        </ThemedText>
        <AppImage src="/banner/banner_5.png" style={styles.banner} radius={20} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    padding: 16,
    gap: 14,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1A1D2E',
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: '#495057',
  },
  banner: {
    width: '100%',
    aspectRatio: 16 / 7,
  },
});
