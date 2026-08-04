import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import { resolveImage } from '@/lib/assets';

const SPLASH_DURATION = 2600;

export function SplashOverlay({ onDone }: { onDone: () => void }) {
  const [logoOpacity] = useState(() => new Animated.Value(0));
  const [logoPulse] = useState(() => new Animated.Value(1));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(logoOpacity, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(logoPulse, { toValue: 1.06, duration: 1100, useNativeDriver: true }),
          Animated.timing(logoPulse, { toValue: 1, duration: 1100, useNativeDriver: true }),
        ]),
      ),
    ]).start();
  }, [logoOpacity, logoPulse]);

  useEffect(() => {
    const t = setTimeout(onDone, SPLASH_DURATION);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <View style={styles.overlay}>
      <Image source={resolveImage('/background/bg.png')} style={StyleSheet.absoluteFill} contentFit="cover" />
      <Animated.View
        style={[
          styles.logoWrap,
          {
            opacity: logoOpacity,
            transform: [{ scale: logoPulse }],
          },
        ]}>
        <Image source={resolveImage('/logo/tix_logo.png')} style={styles.logo} contentFit="contain" />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 1000,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 264,
    height: 108,
  },
});
