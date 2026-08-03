/**
 * Artatix Theme System - Clean White Backgrounds & Saturated Blue Accents
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#0b1a3d',
    textSecondary: '#444654',
    background: '#ffffff',
    backgroundElement: '#f4f6fc',
    backgroundSelected: '#eaedff',
    primary: '#0e3ec7',
    primaryContainer: '#3559e0',
    onPrimary: '#ffffff',
    secondary: '#a33800',
    secondaryContainer: '#cd4800',
    onSecondary: '#ffffff',
    outline: '#747686',
    outlineVariant: '#c4c5d7',
    surfaceContainerLowest: '#ffffff',
    surfaceContainerLow: '#f4f6fc',
    surfaceContainer: '#eaedff',
    surfaceContainerHigh: '#e3e7ff',
    surfaceContainerHighest: '#dbe1ff',
  },
  dark: {
    text: '#0b1a3d', // Clean light UI requested by user
    textSecondary: '#444654',
    background: '#ffffff',
    backgroundElement: '#f4f6fc',
    backgroundSelected: '#eaedff',
    primary: '#0e3ec7',
    primaryContainer: '#3559e0',
    onPrimary: '#ffffff',
    secondary: '#ff6b2b',
    secondaryContainer: '#cd4800',
    onSecondary: '#ffffff',
    outline: '#747686',
    outlineVariant: '#c4c5d7',
    surfaceContainerLowest: '#ffffff',
    surfaceContainerLow: '#f4f6fc',
    surfaceContainer: '#eaedff',
    surfaceContainerHigh: '#e3e7ff',
    surfaceContainerHighest: '#dbe1ff',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'System',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'Plus Jakarta Sans',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "'Plus Jakarta Sans', sans-serif",
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
