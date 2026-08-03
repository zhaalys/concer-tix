import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppImage } from '@/components/AppImage';
import { ScreenHeader } from '@/components/ScreenHeader';

const JOURNEY_IMAGES = [
  '/image_merchandise/merchandise1.png',
  '/image_merchandise/lanyard1.png',
  '/image_merchandise/merchandise.png',
  '/image_merchandise/lanyard.png',
];

export default function OurJourneyScreen() {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.container}>
      <ScreenHeader title="Our Journey" />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 40 + insets.bottom }]} showsVerticalScrollIndicator={false}>
        {JOURNEY_IMAGES.map((img) => (
          <AppImage key={img} src={img} style={styles.image} radius={16} />
        ))}
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
    gap: 16,
  },
  image: {
    width: '100%',
    aspectRatio: 16 / 10,
  },
});
