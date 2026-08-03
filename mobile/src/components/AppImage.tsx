import { Image, type ImageProps } from 'expo-image';
import type { ImageStyle } from 'react-native';

import { resolveImage } from '@/lib/assets';

export type AppImageProps = Omit<ImageProps, 'source'> & {
  src?: string | null;
  radius?: number;
};

export function AppImage({ src, radius, style, contentFit = 'cover', ...rest }: AppImageProps) {
  return (
    <Image
      source={resolveImage(src)}
      contentFit={contentFit}
      transition={150}
      style={[radius != null ? ({ borderRadius: radius } as ImageStyle) : null, style]}
      {...rest}
    />
  );
}
