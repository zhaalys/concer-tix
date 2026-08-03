import { Platform, StyleSheet, Text, type TextProps } from 'react-native';

import { Fonts, ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ThemedTextProps = TextProps & {
  type?:
    | 'default'
    | 'title'
    | 'headlineXl'
    | 'headlineLg'
    | 'headlineMd'
    | 'bodyLg'
    | 'bodyMd'
    | 'labelMd'
    | 'priceTag'
    | 'small'
    | 'smallBold'
    | 'subtitle'
    | 'link'
    | 'linkPrimary'
    | 'code';
  themeColor?: ThemeColor;
};

export function ThemedText({ style, type = 'default', themeColor, ...rest }: ThemedTextProps) {
  const theme = useTheme();

  return (
    <Text
      style={[
        { color: theme[themeColor ?? 'text'], fontFamily: Fonts?.sans },
        type === 'default' && styles.default,
        type === 'headlineXl' && styles.headlineXl,
        type === 'headlineLg' && styles.headlineLg,
        type === 'headlineMd' && styles.headlineMd,
        type === 'bodyLg' && styles.bodyLg,
        type === 'bodyMd' && styles.bodyMd,
        type === 'labelMd' && styles.labelMd,
        type === 'priceTag' && styles.priceTag,
        type === 'title' && styles.title,
        type === 'small' && styles.small,
        type === 'smallBold' && styles.smallBold,
        type === 'subtitle' && styles.subtitle,
        type === 'link' && styles.link,
        type === 'linkPrimary' && styles.linkPrimary,
        type === 'code' && styles.code,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  headlineXl: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '700',
  },
  headlineLg: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '700',
  },
  headlineMd: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600',
  },
  bodyLg: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
  },
  bodyMd: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
  },
  labelMd: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  priceTag: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
  },
  small: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  smallBold: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
  },
  default: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 22,
    lineHeight: 30,
    fontWeight: '600',
  },
  link: {
    lineHeight: 20,
    fontSize: 14,
  },
  linkPrimary: {
    lineHeight: 20,
    fontSize: 14,
    color: '#0E9375',
    fontWeight: '600',
  },
  code: {
    fontFamily: Fonts?.mono,
    fontWeight: Platform.select({ android: '700' }) ?? '500',
    fontSize: 12,
  },
});
