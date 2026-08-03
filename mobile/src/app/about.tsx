import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppImage } from '@/components/AppImage';
import { ScreenHeader } from '@/components/ScreenHeader';
import { ThemedText } from '@/components/themed-text';
import { ABOUT_PARAGRAPHS } from '@/lib/content';

export default function AboutScreen() {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.container}>
      <ScreenHeader title="About" />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 40 + insets.bottom }]} showsVerticalScrollIndicator={false}>
        <AppImage src="/banner/banner_3.png" style={styles.banner} radius={20} />
        <View style={styles.paragraphs}>
          {ABOUT_PARAGRAPHS.map((p, i) => (
            <ThemedText key={i} style={styles.paragraph}>
              {p}
            </ThemedText>
          ))}
        </View>
        <AppImage src="/lanyard_looping/looping_lanyard.png" style={styles.lanyard} contentFit="contain" />
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
    gap: 20,
  },
  banner: {
    width: '100%',
    aspectRatio: 16 / 7,
  },
  paragraphs: {
    gap: 14,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 22,
    color: '#495057',
  },
  lanyard: {
    width: '100%',
    height: 80,
  },
});
