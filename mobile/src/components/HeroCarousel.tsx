import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';

import { AppImage } from './AppImage';
import { HERO_SLIDES } from '@/lib/content';

const { width } = Dimensions.get('window');
const AUTOPLAY_MS = 7000;

export function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const goTo = useCallback((i: number) => {
    const clamped = ((i % HERO_SLIDES.length) + HERO_SLIDES.length) % HERO_SLIDES.length;
    scrollRef.current?.scrollTo({ x: clamped * width, animated: true });
  }, []);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / width);
    if (i !== index && i >= 0 && i < HERO_SLIDES.length) setIndex(i);
  };

  useEffect(() => {
    const t = setInterval(() => goTo(index + 1), AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [index, goTo]);

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        style={styles.scroll}>
        {HERO_SLIDES.map((slide, i) => (
          <View key={slide} style={{ width }}>
            <AppImage src={slide} style={styles.slide} radius={20} />
          </View>
        ))}
      </ScrollView>
      <View style={styles.dots}>
        {HERO_SLIDES.map((s, i) => (
          <Pressable
            key={s}
            onPress={() => goTo(i)}
            style={[styles.dot, i === index && styles.dotActive]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  scroll: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  slide: {
    width: '100%',
    height: 210,
  },
  dots: {
    position: 'absolute',
    bottom: 12,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  dotActive: {
    width: 22,
    backgroundColor: '#0d1b3e',
  },
});
